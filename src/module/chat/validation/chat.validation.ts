import { Injectable } from '@nestjs/common';
import { IPrismaTR } from '../../../prisma';
import { ChatRepository } from '../chat.repository';
import {
	ChatDoubleException,
	ChatNotFoundException,
	UserNotAccessException
} from "../exceptions/chat.exceptions";
import { IChatPreCreate } from '../interfaces/chat-pre-create.interface';

@Injectable()
export class ChatValidation {
	public constructor(private readonly chatRepository: ChatRepository) {}

	// Проверка, что чат существует
	public async assertChatExists(tx: IPrismaTR, chatId: number): Promise<void> {
		const chat = await this.chatRepository.show(chatId, tx);
		if (!chat) {
			throw new ChatNotFoundException();
		}
	}

	// Проверка, что чат мой
	public async assertMy(tx: IPrismaTR, chatId: number, userId: number, isAdmin?: boolean): Promise<void> {
		const chat = await this.chatRepository.show(chatId, tx);
		if (!chat) {
			throw new ChatNotFoundException();
		}
		if (chat.publisherId !== userId && chat.advertiserId !== userId && !isAdmin) {
			throw new UserNotAccessException();
		}
	}

	// Проверка, что чат уникален
	public async assertUniqueChat(tx: IPrismaTR, data: IChatPreCreate): Promise<void> {
		if (data.publicationId && data.publisherId && data.advertiserId) {
			const chats = await this.chatRepository.index(
				{
					where: {
						publicationId: data.publicationId,
						publisherId: data.publisherId,
						advertiserId: data.advertiserId,
					},
				},
				tx,
			);

			if (chats.length !== 0) {
				throw new ChatDoubleException();
			}
		}
	}
}
