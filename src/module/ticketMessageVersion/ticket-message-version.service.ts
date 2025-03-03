import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { TicketMessageVersionCreateDto } from './dto/ticket-message-version.create.dto';
import { TicketMessageVersionDto } from './dto/ticket-message-version.dto';
import { TicketMessageVersionRepository } from './ticket-message-version.repository';
import { TicketMessageVersionFilterDto } from './dto/ticket-message-version.filter.dto';
import { TicketMessageVersionNotFoundException } from './exceptions/ticket-message-version.exceptions';
import { ITicketMessageVersionFilter } from './interfaces/ticket-message-version.prisma.interface';
import { MessageVersionFilterDto } from "../messageVersion/dto/message-version.filter.dto";
import { MessageVersionDto } from "../messageVersion/dto/message-version.dto";
import { IMessageVersionFilter } from "../messageVersion/interfaces/message-version.prisma.interface";
import { MessageVersionNotFoundException } from "../messageVersion/exceptions/message-version.exceptions";

@Injectable()
export class TicketMessageVersionService {
	constructor(
		private prisma: PrismaService,
		private ticketMessageVersionRepo: TicketMessageVersionRepository,
	) {}

	/**
	 * Получение списка сообщений архива
	 *
	 * @param url
	 * @param ticketMessageVersionFilter
	 */
	async messageVersionList(
		url: string,
		ticketMessageVersionFilter: TicketMessageVersionFilterDto,
	): Promise<PaginationInterface<MessageVersionDto>> {
		const page = Number(ticketMessageVersionFilter.page ?? 1);
		const limit = Number(ticketMessageVersionFilter.limit ?? 10);
		const whereCondition: ITicketMessageVersionFilter = {
			messageId: ticketMessageVersionFilter.messageId || undefined,
		};

		// Список сообщений архива
		const [ticketMessageVersions, totalRows] = await this.prisma.$transaction(async (tx) => {
			const ticketMessageVersions = await this.ticketMessageVersionRepo.index(
				{
					skip: (page - 1) * limit,
					take: limit,
					where: whereCondition,
					orderBy: { createdAt: 'desc' },
				},
				tx,
			);

			if (!ticketMessageVersions.length) {
				throw new TicketMessageVersionNotFoundException();
			}

			const total = await this.ticketMessageVersionRepo.totalRows({ where: whereCondition }, tx);

			return [ticketMessageVersions, total];
		});

		return {
			data: ticketMessageVersions.map((ticketMessageVersion) => new TicketMessageVersionDto(ticketMessageVersion)),
			meta: {
				currentPage: page,
				lastPage: Math.ceil(totalRows / limit),
				perPage: limit,
				from: (page - 1) * limit + 1,
				to: Math.min((page - 1) * limit + limit, totalRows),
				total: totalRows,
				path: url,
			},
		};
	}

	/**
	 * Получение одного сообщения архива
	 *
	 * @param messageVersionId
	 */
	async getMessageVersion(messageVersionId: number): Promise<TicketMessageVersionDto> {
		return this.prisma.$transaction(async (tx) => {
			const ticketMessageVersion = await this.ticketMessageVersionRepo.show(messageVersionId, tx);
			if (!ticketMessageVersion) {
				throw new TicketMessageVersionNotFoundException();
			}

			return new TicketMessageVersionDto(ticketMessageVersion);
		});
	}

	/**
	 * Создание нового сообщения в архиве
	 *
	 * @param data
	 */
	async createMessageVersion(data: TicketMessageVersionCreateDto): Promise<TicketMessageVersionDto> {
		return this.prisma.$transaction(async (tx) => {
			// Добавим сообщение в архив
			const newTicketMessageVersion = await this.ticketMessageVersionRepo.store(data, tx);

			return new TicketMessageVersionDto(newTicketMessageVersion);
		});
	}
}
