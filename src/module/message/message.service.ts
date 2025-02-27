import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { MessageRepository } from './message.repository';
import { MessageUpdateDto } from './dto/message.update.dto';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { MessageCreateDto } from './dto/message.create.dto';
import { MessageDto } from './dto/message.dto';
import { IMessage } from './interfaces/message.prisma.interface';
import { MessageVersionService } from '../messageVersion/message-version.service';
import { MessageValidation } from './validation/message.validation';
import { ChatValidation } from '../chat/validation/chat.validation';
import { ChatGateway } from '../../gateway/chat/chat.gateway';
import { EUserType } from '@prisma/client';
import { NotAccessException } from '../../common/exceptions/http-error-exception';

@Injectable()
export class MessageService {
	constructor(
		private prisma: PrismaService,
		private messageRepo: MessageRepository,
		private messageValidator: MessageValidation,
		private chatValidator: ChatValidation,
		@Inject(forwardRef(() => MessageVersionService))
		private messageVersionService: MessageVersionService,
		private readonly chatGateway: ChatGateway,
	) {}

	/**
	 * Получить сообщение по ID
	 *
	 * @param messageId
	 * @param userId
	 * @param isAdmin
	 */
	async getMessage(messageId: number, userId: number, isAdmin: boolean = false): Promise<MessageDto> {
		return this.prisma.$transaction(async (tx) => {
			await this.messageValidator.assertMy(tx, messageId, userId, isAdmin);
			const message = await this.messageRepo.show(messageId, tx);

			return new MessageDto(message as IMessage);
		});
	}

	/**
	 * Создать новое сообщение
	 *
	 * @param data
	 * @param userId
	 * @param isAdmin
	 */
	async createMessage(data: MessageCreateDto, userId: number, isAdmin: boolean = false): Promise<MessageDto> {
		return this.prisma.$transaction(async (tx) => {
			await this.chatValidator.assertMy(tx, data.chatId, userId, isAdmin);
			if (data.replyTo) {
				await this.messageValidator.assertMessageExists(tx, data.replyTo);
			}

			// Создадим сообщение
			const newMessage = await this.messageRepo.store(userId, data, tx);

			// Событие в сокете о новом сообщении
			await this.chatGateway.handleSyncMessage({
				chatId: newMessage.chatId,
				senderId: newMessage.userId,
				userType: data.userType ?? EUserType.BUYER,
				content: newMessage.content ?? null,
				replyTo: newMessage.replyToId ?? null,
			});

			return new MessageDto(newMessage as IMessage);
		});
	}

	/**
	 * Обновить сообщение
	 *
	 * @param messageId
	 * @param data
	 * @param userId
	 * @param isAdmin
	 */
	async updateMessage(
		messageId: number,
		data: MessageUpdateDto,
		userId: number,
		isAdmin: boolean = false,
	): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим текущее состояние сообщения
			const currentVersion = await this.getMessage(messageId, userId);

			if (currentVersion.userId !== userId && !isAdmin) {
				throw new NotAccessException();
			}

			// Отправить текущее сообщение в историю
			await this.messageVersionService.createMessageVersion({
				messageId: currentVersion.messageId,
				content: currentVersion.content,
			});

			// Обновить текушее сообшение
			await this.messageRepo.update(
				{
					where: { id: messageId },
					data: data,
				},
				tx,
			);

			return { success: true };
		});
	}

	/**
	 * Удалить сообщение
	 *
	 * @param messageId
	 * @param userId
	 * @param isAdmin
	 */
	async deleteMessage(messageId: number, userId: number, isAdmin: boolean = false): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			await Promise.all([this.messageValidator.assertMy(tx, messageId, userId, isAdmin)]);
			await this.messageRepo.destroy({ id: messageId }, tx);

			return { success: true };
		});
	}
}
