import { forwardRef, Module } from '@nestjs/common';
import { TicketMessageVersionService } from './ticket-message-version.service';
import { TicketMessageVersionRepository } from './ticket-message-version.repository';
import { TicketMessageVersionController } from './ticket-message-version.controller';
import { TicketMessageModule } from '../ticketMessage/ticket-message.module';

@Module({
	imports: [forwardRef(() => TicketMessageModule)],
	controllers: [TicketMessageVersionController],
	providers: [TicketMessageVersionService, TicketMessageVersionRepository],
	exports: [TicketMessageVersionService, TicketMessageVersionRepository],
})
export class TicketMessageVersionModule {}
