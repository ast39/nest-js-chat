import { Injectable } from '@nestjs/common';
import { IPrismaTR } from '../../../prisma';
import { TicketRepository } from '../ticket.repository';
import {
	TicketInProgressException, TicketIsCloseException,
	TicketNotFoundException,
	UserNotAccessException
} from "../exceptions/ticket.exceptions";
import { TicketDoubleException } from "../exceptions/ticket.exceptions";
import { ETicketStatus } from "@prisma/client";

@Injectable()
export class TicketValidation {
	public constructor(private readonly ticketRepository: TicketRepository) {}

	// Проверка, что тикет существует
	public async assertTicketExists(tx: IPrismaTR, chatId: number): Promise<void> {
		const ticket = await this.ticketRepository.show(chatId, tx);
		if (!ticket) {
			throw new TicketNotFoundException();
		}
	}

	// Проверка, что тикет мой
	public async assertMy(tx: IPrismaTR, ticketId: number, userId: number, isAdmin?: boolean): Promise<void> {
		const ticket = await this.ticketRepository.show(ticketId, tx);
		if (ticketId !== userId && !isAdmin) {
			throw new UserNotAccessException();
		}
	}

	// Проверка, что тикет уникален
	public async assertUniqueTicket(tx: IPrismaTR, ticketId: number): Promise<void> {
		const ticket = await this.ticketRepository.show(ticketId, tx);

		if (ticket) {
			throw new TicketDoubleException();
		}
	}

	public async assertForProgress(tx: IPrismaTR, ticketId: number, userId: number): Promise<void> {
		const ticket = await this.ticketRepository.show(ticketId, tx);

		if (!ticket) {
			throw new TicketNotFoundException();
		}

		if (ticket.status === ETicketStatus.PROGRESS && ticket.assigned !== userId) {
			throw new TicketInProgressException();
		}
	}

	public async assertForClose(tx: IPrismaTR, ticketId: number): Promise<void> {
		const ticket = await this.ticketRepository.show(ticketId, tx);

		if (!ticket) {
			throw new TicketNotFoundException();
		}

		if (ticket.status === ETicketStatus.CLOSE) {
			throw new TicketIsCloseException();
		}
	}
}
