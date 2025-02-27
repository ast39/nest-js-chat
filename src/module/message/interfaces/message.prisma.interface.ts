import { Prisma, Message } from '@prisma/client';

export type IMessage = Message;

export type IMessageCreate = Prisma.MessageCreateInput;
export type IMessageUpdate = Prisma.MessageUpdateInput;
export type IMessageFilter = Prisma.MessageWhereInput;
export type IMessageUnique = Prisma.MessageWhereUniqueInput;
export type IMessageOrder = Prisma.MessageOrderByWithRelationInput;
