import { Prisma, MessageVersion } from '@prisma/client';

export interface ITicketMessageVersion extends MessageVersion {}

export type ITicketMessageVersionCreate = Prisma.TicketMessageVersionCreateInput;
export type ITicketMessageVersionUpdate = Prisma.TicketMessageVersionUpdateInput;
export type ITicketMessageVersionFilter = Prisma.TicketMessageVersionWhereInput;
export type ITicketMessageVersionUnique = Prisma.TicketMessageVersionWhereUniqueInput;
export type ITicketMessageVersionOrder = Prisma.TicketMessageVersionOrderByWithRelationInput;
