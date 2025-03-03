import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TicketRepository } from './ticket.repository';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { TicketValidation } from './validation/ticket.validation';
import { TicketFilterDto } from "./dto/ticket-filter.dto";
import { ITicket, ITicketFilter } from "./interfaces/ticket.prisma.interface";
import { TicketDto } from "./dto/ticket.dto";
import { TicketCreateDto } from "./dto/ticket-create.dto";
import { TicketMessageRepository } from "../ticketMessage/ticket-message.repository";
import { TicketNotFoundException } from "./exceptions/ticket.exceptions";
import { TicketUpdateDto } from "./dto/ticket-update.dto";
import { TicketGateway } from "../../gateway/ticket/ticket.gateway";
import { EUserType } from "@prisma/client";

@Injectable()
export class TicketService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly ticketRepo: TicketRepository,
		private readonly ticketValidator: TicketValidation,
		private readonly ticketMessageRepo: TicketMessageRepository,
		private readonly ticketGateway: TicketGateway,
	) {}

	/**
	 * Список тикетов
	 *
	 * @param url
	 * @param ticketFilter
	 * @param userId
	 * @param isAdmin
	 */
	async ticketList(
		url: string,
		ticketFilter: TicketFilterDto,
		userId: number,
		isAdmin: boolean = false,
	): Promise<PaginationInterface<TicketDto>> {
		const page = Number(ticketFilter.page ?? 1);
		const limit = Number(ticketFilter.limit ?? 10);

		// Условия фильтрации
		const whereCondition: ITicketFilter = {
			status: ticketFilter.status || undefined,
			isDeleted: false,
			...(isAdmin ? {} : { id: userId }),
		};

		const [tickets, totalRows] = await this.prisma.$transaction(async (tx) => {
			const tickets = await this.ticketRepo.index(
				{
					skip: (page - 1) * limit,
					take: limit,
					where: whereCondition,
					orderBy: { createdAt: 'desc' },
				},
				tx,
			);

			if (!tickets.length) {
				throw new TicketNotFoundException();
			}

			const total = await this.ticketRepo.totalRows({ where: whereCondition }, tx);

			return [tickets, total];
		});

		return {
			data: tickets.map((ticket) => new TicketDto(ticket as ITicket)),
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
	 * Получить тикет по ID
	 *
	 * @param ticketId
	 * @param userId
	 * @param isAdmin
	 */
	async getTicket(ticketId: number, userId: number, isAdmin: boolean = false): Promise<TicketDto> {
		return this.prisma.$transaction(async (tx) => {
			const ticket = await this.ticketRepo.show(ticketId, tx);
			if (!ticket || ticket.isDeleted) {
				throw new TicketNotFoundException();
			}

			await Promise.all([this.ticketValidator.assertMy(tx, ticketId, userId, isAdmin)]);

			return new TicketDto(ticket as ITicket, userId);
		});
	}

	/**
	 * Создать тикет
	 *
	 * @param data
	 * @param userId
	 */
	async createTicket(data: TicketCreateDto, userId: number): Promise<TicketDto> {
		return this.prisma.$transaction(async (tx) => {
			await this.ticketValidator.assertUniqueTicket(tx, data.userId);
			const newTicket = await this.ticketRepo.store(data, tx);

			return new TicketDto(newTicket as ITicket);
		});
	}

	/**
	 * Обновить тикет
	 *
	 * @param ticketId
	 * @param data
	 * @param userId
	 * @param isAdmin
	 */
	async updateTicket(
		ticketId: number,
		data: TicketUpdateDto,
		userId: number,
		isAdmin: boolean = false,
	): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			await Promise.all([
				this.ticketValidator.assertTicketExists(tx, ticketId),
				this.ticketValidator.assertMy(tx, ticketId, userId, isAdmin)
			]);

			await this.ticketRepo.update(
				{
					where: { id: ticketId },
					data: data,
				},
				tx,
			);

			return { success: true };
		});
	}

	/**
	 * Прочитать сообщения тикета
	 *
	 * @param ticketId
	 * @param userId
	 * @param isAdmin
	 */
	async readTicketMessages(ticketId: number, userId: number, isAdmin: boolean = false): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			await Promise.all([
				this.ticketValidator.assertTicketExists(tx, ticketId),
				this.ticketValidator.assertMy(tx, ticketId, userId, isAdmin)]
			);
			await this.ticketMessageRepo.readMessages(ticketId, userId, tx);

			await this.ticketGateway.handleReadChat({
				ticketId: ticketId,
				userType: isAdmin ? EUserType.SUPPORT : EUserType.CLIENT,
			});

			return { success: true };
		});
	}

	/**
	 * Удалить тикет
	 *
	 * @param ticketId
	 * @param userId
	 * @param isAdmin
	 */
	async deleteTicket(ticketId: number, userId: number, isAdmin: boolean = false): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			await Promise.all([
				this.ticketValidator.assertTicketExists(tx, ticketId),
				this.ticketValidator.assertMy(tx, ticketId, userId, isAdmin)
			]);

			await this.ticketRepo.destroy({ id: ticketId }, tx);

			return { success: true };
		});
	}
}
