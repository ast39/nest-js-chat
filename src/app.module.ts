import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma';
import { ChatModule } from './module/chat/chat.module';
import { MessageModule } from './module/message/message.module';
import { MessageVersionModule } from './module/messageVersion/message-version.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { ChatGatewayModule } from './gateway/chat/chat-gateway.module';
import { TicketModule } from "./module/ticket/ticket.module";
import { TicketMessageModule } from "./module/ticketMessage/ticket-message.module";
import { TicketMessageVersionModule } from "./module/ticketMessageVersion/ticket-message-version.module";
import { TicketGatewayModule } from "./gateway/ticket/ticket-gateway.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: join('.dev.env'),
		}),
		PrismaModule,
		ChatGatewayModule,
		TicketGatewayModule,

		ChatModule,
		MessageModule,
		MessageVersionModule,

		TicketModule,
		TicketMessageModule,
		TicketMessageVersionModule,
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
