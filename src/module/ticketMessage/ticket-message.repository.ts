import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import { ITicketMessageFilter, ITicketMessageOrder, ITicketMessageUnique } from './interfaces/ticket-message.prisma.interface';
import { TicketMessageUpdateDto } from './dto/ticket-message.update.dto';
import { TicketMessageCreateDto } from './dto/ticket-message.create.dto';
import { TicketMessage, EMessageStatus, EUserType } from "@prisma/client";

@Injectable()
export class TicketMessageRepository {
	constructor(private prisma: PrismaService) {}

	// Всего сообщений без пагинации
	async totalRows(params: { cursor?: ITicketMessageUnique; where?: ITicketMessageFilter }, tx?: IPrismaTR): Promise<number> {
		const { cursor, where } = params;
		const prisma = tx ?? this.prisma;

		return prisma.ticketMessage.count({ cursor, where });
	}

	// Список сообщений
	async index(
		params: { skip?: number; take?: number; where?: ITicketMessageFilter; orderBy?: ITicketMessageOrder },
		tx?: IPrismaTR,
	): Promise<TicketMessage[]> {
		const { skip, take, where, orderBy } = params;
		const prisma = tx ?? this.prisma;

		return prisma.ticketMessage.findMany({ skip, take, where, orderBy });
	}

	// Сообщение по ID
	async show(messageId: number, tx?: IPrismaTR): Promise<TicketMessage> {
		const prisma = tx ?? this.prisma;

		return prisma.ticketMessage.findUnique({
			where: { id: +messageId },
		});
	}

	// Добавить сообщение
	async store(userId: number, data: TicketMessageCreateDto, tx?: IPrismaTR): Promise<TicketMessage> {
		const prisma = tx ?? this.prisma;

		return prisma.ticketMessage.create({
			data: {
				ticketId: data.ticketId,
				replyToId: data.replyTo || null,
				userId: userId,
				userType: data.userType ?? EUserType.ADVERTISER,
				content: data.content ?? '',
				status: data.status ?? EMessageStatus.ACTIVE,
			},
		});
	}

	// Обновить сообщение
	async update(params: { where: ITicketMessageUnique; data: TicketMessageUpdateDto }, tx?: IPrismaTR): Promise<TicketMessage> {
		const { where, data } = params;
		const prisma = tx ?? this.prisma;

		return prisma.ticketMessage.update({ where, data });
	}

	// Удалить сообщение (мягкое удаление)
	async destroy(where: ITicketMessageUnique, tx?: IPrismaTR): Promise<TicketMessage> {
		const prisma = tx ?? this.prisma;

		return prisma.ticketMessage.update({
			where,
			data: { isDeleted: true },
		});
	}

	// Прочитать сообщения чата
	async readMessages(chatId: number, userId: number, tx?: IPrismaTR): Promise<number> {
		const prisma = tx ?? this.prisma;
		const result = await prisma.ticketMessage.updateMany({
			where: { id: chatId, NOT: { userId: userId } },
			data: { isRead: true },
		});

		return result.count;
	}
}
