import { Prisma, Ticket } from "@prisma/client";
import { ITicketMessage } from "../../ticketMessage/interfaces/ticket-message.prisma.interface";

export interface ITicket extends Ticket {
	messages: ITicketMessage[];
}

export type ITicketCreate = Prisma.TicketCreateInput;
export type ITicketUpdate = Prisma.TicketUpdateInput;
export type ITicketFilter = Prisma.TicketWhereInput;
export type ITicketUnique = Prisma.TicketWhereUniqueInput;
export type ITicketOrder = Prisma.TicketOrderByWithRelationInput;
