import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_ACCESS_SECRET || 'defaultSecret',
			signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRED },
		}),
	],
	providers: [ChatGateway],
	exports: [ChatGateway],
})
export class ChatGatewayModule {}
