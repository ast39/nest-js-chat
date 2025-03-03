import { forwardRef, Module } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TicketValidation } from './validation/ticket.validation';
import { TicketMessageModule } from "../ticketMessage/ticket-message.module";
import { TicketGatewayModule } from "../../gateway/ticket/ticket-gateway.module";

@Module({
	imports: [forwardRef(() => TicketMessageModule), TicketGatewayModule],
	controllers: [TicketController],
	providers: [TicketService, TicketRepository, TicketValidation],
	exports: [TicketService, TicketRepository, TicketValidation],
})
export class TicketModule {}
