import { Injectable } from '@nestjs/common';
import { IPrismaTR } from '../../../prisma';
import { ChatRepository } from '../chat.repository';
import {
	ChatDoubleException,
	ChatNotFoundException,
	UserNotAccessException
} from "../exceptions/chat.exceptions";
import { IChatCreate } from '../interfaces/chat-create.interface';

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
		if (chat.sellerId !== userId && chat.buyerId !== userId && !isAdmin) {
			throw new UserNotAccessException();
		}
	}

	// Проверка, что чат уникален
	public async assertUniqueChat(tx: IPrismaTR, data: IChatCreate): Promise<void> {
		if (data.orderId && data.sellerId && data.buyerId) {
			const chats = await this.chatRepository.index(
				{
					where: {
						orderId: data.orderId,
						sellerId: data.sellerId,
						buyerId: data.buyerId,
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
