import { forwardRef, Module } from '@nestjs/common';
import { MessageVersionService } from './message-version.service';
import { MessageVersionRepository } from './message-version.repository';
import { MessageVersionController } from './message-version.controller';
import { MessageModule } from '../message/message.module';

@Module({
	imports: [forwardRef(() => MessageModule)],
	controllers: [MessageVersionController],
	providers: [MessageVersionService, MessageVersionRepository],
	exports: [MessageVersionService, MessageVersionRepository],
})
export class MessageVersionModule {}
