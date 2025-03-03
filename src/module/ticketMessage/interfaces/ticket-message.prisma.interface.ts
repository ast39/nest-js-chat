import { Prisma, Message, TicketMessage } from "@prisma/client";

export type ITicketMessage = TicketMessage;

export type ITicketMessageCreate = Prisma.TicketMessageCreateInput;
export type ITicketMessageUpdate = Prisma.TicketMessageUpdateInput;
export type ITicketMessageFilter = Prisma.TicketMessageWhereInput;
export type ITicketMessageUnique = Prisma.TicketMessageWhereUniqueInput;
export type ITicketMessageOrder = Prisma.TicketMessageOrderByWithRelationInput;
