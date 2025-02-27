import { Injectable } from '@nestjs/common';
import { IPrismaTR } from '../../../prisma';
import { MessageRepository } from '../message.repository';
import { MessageNotFoundException } from '../exceptions/message.exceptions';
import { NotAccessException } from '../../../common/exceptions/http-error-exception';

@Injectable()
export class MessageValidation {
	public constructor(private readonly messageRepository: MessageRepository) {}

	// Проверка, что сообщение существует
	public async assertMessageExists(tx: IPrismaTR, messageId: number): Promise<void> {
		const message = await this.messageRepository.show(messageId, tx);
		if (!message) {
			throw new MessageNotFoundException();
		}
	}

	// Проверка, что сообщение принадлежит пользователя
	public async assertMy(tx: IPrismaTR, messageId: number, userId: number, isAdmin?: boolean): Promise<void> {
		const message = await this.messageRepository.show(messageId, tx);
		if (!message) {
			throw new MessageNotFoundException();
		}
		if (message.userId !== userId && !isAdmin) {
			throw new NotAccessException();
		}
	}
}
