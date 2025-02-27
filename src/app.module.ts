import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma';
import { ChatModule } from './module/chat/chat.module';
import { MessageModule } from './module/message/message.module';
import { MessageVersionModule } from './module/messageVersion/message-version.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { ChatGatewayModule } from './gateway/chat/chat-gateway.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: join('.dev.env'),
		}),
		PrismaModule,
		ChatGatewayModule,
		ChatModule,
		MessageModule,
		MessageVersionModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.exclude({
				path: '/auth/(.*)',
				method: RequestMethod.ALL,
			})
			.forRoutes('*');
	}
}
