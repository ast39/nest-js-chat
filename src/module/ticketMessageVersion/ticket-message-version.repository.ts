import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import {
	ITicketMessageVersionFilter,
	ITicketMessageVersionOrder,
	ITicketMessageVersionUnique,
} from './interfaces/ticket-message-version.prisma.interface';
import { TicketMessageVersionCreateDto } from './dto/ticket-message-version.create.dto';
import { TicketMessageVersion } from "@prisma/client";
@Injectable()
export class TicketMessageVersionRepository {
	constructor(private prisma: PrismaService) {}

	// Всего сообщений без пагинации
	async totalRows(
		params: {
			cursor?: ITicketMessageVersionUnique;
			where?: ITicketMessageVersionFilter;
		},
		tx?: IPrismaTR,
	): Promise<number> {
		const { cursor, where } = params;
		const prisma = tx ?? this.prisma;

		return prisma.ticketMessageVersion.count({
			cursor,
			where,
		});
	}

	// Список сообщений
	async index(
		params: {
			skip?: number;
			take?: number;
			where?: ITicketMessageVersionFilter;
			orderBy?: ITicketMessageVersionOrder;
		},
		tx?: IPrismaTR,
	): Promise<TicketMessageVersion[]> {
		const { skip, take, where, orderBy } = params;
		const prisma = tx ?? this.prisma;

		return prisma.ticketMessageVersion.findMany({
			skip,
			take,
			where,
			orderBy,
		});
	}

	// Сообщение по ID
	async show(messageVersionId: number, tx?: IPrismaTR): Promise<TicketMessageVersion> {
		const prisma = tx ?? this.prisma;

		return prisma.ticketMessageVersion.findUnique({
			where: { id: messageVersionId },
		});
	}

	// Добавить сообщение
	async store(data: TicketMessageVersionCreateDto, tx?: IPrismaTR): Promise<TicketMessageVersion> {
		const prisma = tx ?? this.prisma;

		return prisma.ticketMessageVersion.create({
			data: {
				messageId: data.messageId,
				content: data.content,
			},
		});
	}
}
