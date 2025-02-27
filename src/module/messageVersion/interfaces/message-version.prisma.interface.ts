import { Prisma, MessageVersion } from '@prisma/client';

export interface IMessageVersion extends MessageVersion {}

export type IMessageVersionCreate = Prisma.MessageVersionCreateInput;
export type IMessageVersionUpdate = Prisma.MessageVersionUpdateInput;
export type IMessageVersionFilter = Prisma.MessageVersionWhereInput;
export type IMessageVersionUnique = Prisma.MessageVersionWhereUniqueInput;
export type IMessageVersionOrder = Prisma.MessageVersionOrderByWithRelationInput;
