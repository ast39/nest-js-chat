import { Injectable } from '@nestjs/common';
import { IPrismaTR } from '../../../prisma';
import { TicketMessageNotFoundException } from '../exceptions/ticket-message.exceptions';
import { NotAccessException } from '../../../common/exceptions/http-error-exception';
import { TicketMessageRepository } from "../ticket-message.repository";

@Injectable()
export class TicketMessageValidation {
	public constructor(private readonly ticketMessageRepository: TicketMessageRepository) {}

	// Проверка, что сообщение существует
	public async assertMessageExists(tx: IPrismaTR, messageId: number): Promise<void> {
		const message = await this.ticketMessageRepository.show(messageId, tx);
		if (!message) {
			throw new TicketMessageNotFoundException();
		}
	}

	// Проверка, что сообщение принадлежит пользователя
	public async assertMy(tx: IPrismaTR, messageId: number, userId: number, isAdmin?: boolean): Promise<void> {
		const message = await this.ticketMessageRepository.show(messageId, tx);
		if (!message) {
			throw new TicketMessageNotFoundException();
		}
		if (message.userId !== userId && !isAdmin) {
			throw new NotAccessException();
		}
	}
}
