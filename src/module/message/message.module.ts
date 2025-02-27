import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageRepository } from './message.repository';
import { MessageController } from './message.controller';
import { ChatModule } from '../chat/chat.module';
import { MessageVersionModule } from '../messageVersion/message-version.module';
import { MessageValidation } from './validation/message.validation';
import { ChatGatewayModule } from '../../gateway/chat/chat-gateway.module';

@Module({
	imports: [forwardRef(() => ChatModule), forwardRef(() => MessageVersionModule), ChatGatewayModule],
	controllers: [MessageController],
	providers: [MessageService, MessageRepository, MessageValidation],
	exports: [MessageService, MessageRepository, MessageValidation],
})
export class MessageModule {}
