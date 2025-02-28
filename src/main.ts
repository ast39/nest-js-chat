import * as process from 'process';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/HttpException.filter';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
	// Загружаем конфигурацию из .env файла
	dotenv.config();

	// Создаем экземпляр приложения
	const app = await NestFactory.create(AppModule);

	// Получаем настройки из конфигурации
	const APP_PORT = parseInt(process.env.APP_PORT) || 3000;
	const API_PREFIX = process.env.API_PREFIX || '/api/v1';
	const SWAGGER_PATH = process.env.SWAGGER_PATH || '/docs';
	const SWAGGER_PREFIX = API_PREFIX + SWAGGER_PATH;
	const APP_URL = process.env.APP_URL || 'http://localhost';

	// Устанавливаем глобальный префикс для всех маршрутов
	app.setGlobalPrefix(API_PREFIX);

	// Подключаем глобальные фильтры и пайпы
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: false,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	// Настраиваем CORS
	app.enableCors({
		origin: true,
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
	});

	// Конфигурируем Swagger документацию
	const docs = new DocumentBuilder()
		.setTitle(process.env.APP_TITLE || 'API')
		.setDescription(process.env.APP_DESC || 'Описание методов API')
		.setVersion(process.env.APP_VERSION || '1.0.0')
		.addBearerAuth()
		.setContact('Alexandr St.', 'https://t.me/ASt39', 'alexandr.statut@gmail.com')
		.setExternalDoc('API Docs', `${APP_URL}${API_PREFIX}/docs-json`)
		.addServer(`${APP_URL}`, 'API Server')
		.build();

	const document = SwaggerModule.createDocument(app, docs);
	SwaggerModule.setup(SWAGGER_PREFIX, app, document, {
		swaggerOptions: {
			persistAuthorization: true,
			docExpansion: 'none',
			filter: true,
			tagsSorter: 'method',
			operationsSorter: 'alpha',
		},
	});

	// Запускаем приложение
	await app.listen(APP_PORT, () => {
		console.log(`Приложение запущено на порту ${APP_PORT}`);
		console.log(`Swagger документация доступна по адресу: ${APP_URL}:${APP_PORT}${SWAGGER_PREFIX}`);
	});
}

bootstrap();
