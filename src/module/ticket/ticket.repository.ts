import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import { ITicketFilter, ITicketOrder, ITicketUnique } from "./interfaces/ticket.prisma.interface";
import { ETicketStatus, Ticket } from "@prisma/client";
import { TicketUpdateDto } from "./dto/ticket-update.dto";
import { TicketCreateDto } from "./dto/ticket-create.dto";

@Injectable()
export class TicketRepository {
	constructor(private prisma: PrismaService) {}

	// Всего тикетов без пагинации
	async totalRows(
		params: {
			cursor?: ITicketUnique;
			where?: ITicketFilter;
		},
		tx?: IPrismaTR,
	): Promise<number> {
		const { cursor, where } = params;
		const prisma = tx ?? this.prisma;

		return prisma.ticket.count({
			cursor,
			where,
		});
	}

	// Список тикетов
	async index(
		params: {
			skip?: number;
			take?: number;
			where?: ITicketFilter;
			orderBy?: ITicketOrder;
		},
		tx?: IPrismaTR,
	): Promise<Ticket[]> {
		const { skip, take, where, orderBy } = params;
		const prisma = tx ?? this.prisma;

		return prisma.ticket.findMany({
			skip,
			take,
			where,
			include: {
				messages: {
					take: 1,
					orderBy: { createdAt: 'desc' },
					where: { isDeleted: false },
				},
			},
			orderBy,
		});
	}

	// Тикет по ID
	async show(ticketId: number, tx?: IPrismaTR): Promise<Ticket> {
		const prisma = tx ?? this.prisma;

		return prisma.ticket.findFirst({
			where: {
				id: ticketId,
				isDeleted: false,
			},
			include: {
				messages: {
					where: { isDeleted: false },
					orderBy: { createdAt: 'desc' },
				},
			},
		});
	}

	// Добавить тикет
	async store(data: TicketCreateDto, tx?: IPrismaTR): Promise<Ticket> {
		const prisma = tx ?? this.prisma;

		return prisma.ticket.create({
			data: {
				id: data.userId,
				status: data.status ?? ETicketStatus.OPEN,
			},
		});
	}

	// Обновить тикет
	async update(
		params: {
			where: ITicketUnique;
			data: TicketUpdateDto;
		},
		tx?: IPrismaTR,
	): Promise<Ticket> {
		const { where, data } = params;
		const prisma = tx ?? this.prisma;
		return prisma.ticket.update({
			where,
			data,
		});
	}

	// Удалить тикет
	async destroy(where: ITicketUnique, tx?: IPrismaTR): Promise<Ticket> {
		const prisma = tx ?? this.prisma;

		return prisma.ticket.update({
			where,
			data: { isDeleted: true },
		});
	}
}
