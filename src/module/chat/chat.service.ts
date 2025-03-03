import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { ChatRepository } from './chat.repository';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { ChatDto } from './dto/chat.dto';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { ChatNotFoundException } from './exceptions/chat.exceptions';
import { IChat, IChatFilter } from './interfaces/chat.prisma.interface';
import { MessageRepository } from '../message/message.repository';
import { ChatValidation } from './validation/chat.validation';
import { ChatFilterDto } from './dto/chat-filter.dto';
import { ChatCreateDto } from './dto/chat-create.dto';
import { ChatUpdateDto } from './dto/chat-update.dto';
import { IChatCreate } from './interfaces/chat-create.interface';
import { ChatGateway } from '../../gateway/chat/chat.gateway';

@Injectable()
export class ChatService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly chatRepo: ChatRepository,
		private readonly chatValidator: ChatValidation,
		private readonly messageRepo: MessageRepository,
		private readonly chatGateway: ChatGateway,
	) {}

	/**
	 * Список чатов
	 *
	 * @param url
	 * @param chatFilter
	 * @param userId
	 * @param isAdmin
	 */
	async chatList(
		url: string,
		chatFilter: ChatFilterDto,
		userId: number,
		isAdmin: boolean = false,
	): Promise<PaginationInterface<ChatDto>> {
		const page = Number(chatFilter.page ?? 1);
		const limit = Number(chatFilter.limit ?? 10);

		// Условия фильтрации
		const whereCondition: IChatFilter = {
			title: {
				contains: chatFilter.title || '',
				mode: 'insensitive',
			},
			publicationId: chatFilter.publicationId || undefined,
			status: chatFilter.status || undefined,
			isDeleted: false,
			...(isAdmin ? {} : { OR: [{ publisherId: userId }, { advertiserId: userId }] }),
		};

		const [chats, totalRows] = await this.prisma.$transaction(async (tx) => {
			const chats = await this.chatRepo.index(
				{
					skip: (page - 1) * limit,
					take: limit,
					where: whereCondition,
					orderBy: { createdAt: 'desc' },
				},
				tx,
			);

			if (!chats.length) {
				throw new ChatNotFoundException();
			}

			const total = await this.chatRepo.totalRows({ where: whereCondition }, tx);

			return [chats, total];
		});

		return {
			data: chats.map((chat) => new ChatDto(chat as IChat)),
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
	 * Получить чат по ID
	 *
	 * @param chatId
	 * @param userId
	 * @param isAdmin
	 */
	async getChat(chatId: number, userId: number, isAdmin: boolean = false): Promise<ChatDto> {
		return this.prisma.$transaction(async (tx) => {
			const chat = await this.chatRepo.show(chatId, tx);
			if (!chat && chat.isDeleted) {
				throw new ChatNotFoundException();
			}

			await Promise.all([this.chatValidator.assertMy(tx, chatId, userId, isAdmin)]);

			return new ChatDto(chat as IChat, userId);
		});
	}

	/**
	 * Создать чат
	 *
	 * @param data
	 * @param userId
	 */
	async createChat(data: ChatCreateDto, userId: number): Promise<ChatDto> {
		return this.prisma.$transaction(async (tx) => {
			const repoData: IChatCreate = {
				...data,
				advertiserId: userId,
				title: `${data.publicationId}-${data.publisherId}-${userId}`,
			};
			await this.chatValidator.assertUniqueChat(tx, repoData);
			const newChat = await this.chatRepo.store(repoData, tx);

			return new ChatDto(newChat as IChat);
		});
	}

	/**
	 * Обновить чат
	 *
	 * @param chatId
	 * @param data
	 * @param userId
	 * @param isAdmin
	 */
	async updateChat(
		chatId: number,
		data: ChatUpdateDto,
		userId: number,
		isAdmin: boolean = false,
	): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			await Promise.all([this.chatValidator.assertMy(tx, chatId, userId, isAdmin)]);

			await this.chatRepo.update(
				{
					where: { id: chatId },
					data: data,
				},
				tx,
			);

			return { success: true };
		});
	}

	/**
	 * Прочитать сообщения чата
	 *
	 * @param chatId
	 * @param userId
	 * @param isAdmin
	 */
	async readChatMessages(chatId: number, userId: number, isAdmin: boolean = false): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			await Promise.all([this.chatValidator.assertMy(tx, chatId, userId, isAdmin)]);
			await this.messageRepo.readMessages(chatId, userId, tx);

			await this.chatGateway.handleReadChat({
				chatId: chatId,
				readerId: userId,
			});

			return { success: true };
		});
	}

	/**
	 * Удалить чат
	 *
	 * @param chatId
	 * @param userId
	 * @param isAdmin
	 */
	async deleteChat(chatId: number, userId: number, isAdmin: boolean = false): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			await Promise.all([this.chatValidator.assertMy(tx, chatId, userId, isAdmin)]);

			await this.chatRepo.destroy({ id: chatId }, tx);

			return { success: true };
		});
	}
}
