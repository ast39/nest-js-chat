import { forwardRef, Module } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { ChatController } from './chat.controller';
import { MessageModule } from '../message/message.module';
import { ChatService } from './chat.service';
import { ChatValidation } from './validation/chat.validation';
import { ChatGatewayModule } from '../../gateway/chat/chat-gateway.module';

@Module({
	imports: [forwardRef(() => MessageModule), ChatGatewayModule],
	controllers: [ChatController],
	providers: [ChatService, ChatRepository, ChatValidation],
	exports: [ChatService, ChatRepository, ChatValidation],
})
export class ChatModule {}
