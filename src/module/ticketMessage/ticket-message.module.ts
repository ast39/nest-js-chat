import { forwardRef, Module } from '@nestjs/common';
import { TicketMessageValidation } from './validation/ticket-message.validation';
import { TicketMessageController } from "./ticket-message.controller";
import { TicketMessageService } from "./ticket-message.service";
import { TicketMessageRepository } from "./ticket-message.repository";
import { TicketMessageVersionModule } from "../ticketMessageVersion/ticket-message-version.module";
import { TicketModule } from "../ticket/ticket.module";
import { TicketGatewayModule } from "../../gateway/ticket/ticket-gateway.module";

@Module({
	imports: [forwardRef(() => TicketModule), forwardRef(() => TicketMessageVersionModule), TicketGatewayModule],
	controllers: [TicketMessageController],
	providers: [TicketMessageService, TicketMessageRepository, TicketMessageValidation],
	exports: [TicketMessageService, TicketMessageRepository, TicketMessageValidation],
})
export class TicketMessageModule {}
