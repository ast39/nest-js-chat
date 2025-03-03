import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import { IChatFilter, IChatOrder, IChatUnique } from './interfaces/chat.prisma.interface';
import { Chat, EChatStatus } from '@prisma/client';
import { ChatUpdateDto } from './dto/chat-update.dto';
import { IChatPreCreate } from './interfaces/chat-pre-create.interface';

@Injectable()
export class ChatRepository {
	constructor(private prisma: PrismaService) {}

	// Всего чатов без пагинации
	async totalRows(
		params: {
			cursor?: IChatUnique;
			where?: IChatFilter;
		},
		tx?: IPrismaTR,
	): Promise<number> {
		const { cursor, where } = params;
		const prisma = tx ?? this.prisma;

		return prisma.chat.count({
			cursor,
			where,
		});
	}

	// Список чатов
	async index(
		params: {
			skip?: number;
			take?: number;
			where?: IChatFilter;
			orderBy?: IChatOrder;
		},
		tx?: IPrismaTR,
	): Promise<Chat[]> {
		const { skip, take, where, orderBy } = params;
		const prisma = tx ?? this.prisma;

		return prisma.chat.findMany({
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

	// Чат по ID
	async show(chatId: number, tx?: IPrismaTR): Promise<Chat> {
		const prisma = tx ?? this.prisma;

		return prisma.chat.findFirst({
			where: {
				id: chatId,
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

	// Добавить чат
	async store(data: IChatPreCreate, tx?: IPrismaTR): Promise<Chat> {
		const prisma = tx ?? this.prisma;

		return prisma.chat.create({
			data: {
				publicationId: data.publicationId,
				publisherId: data.publisherId,
				advertiserId: data.advertiserId,
				title: data.title,
				status: data.status || EChatStatus.ACTIVE,
			},
		});
	}

	// Обновить чат
	async update(
		params: {
			where: IChatUnique;
			data: ChatUpdateDto;
		},
		tx?: IPrismaTR,
	): Promise<Chat> {
		const { where, data } = params;
		const prisma = tx ?? this.prisma;
		return prisma.chat.update({
			where,
			data,
		});
	}

	// Удалить чат
	async destroy(where: IChatUnique, tx?: IPrismaTR): Promise<Chat> {
		const prisma = tx ?? this.prisma;

		return prisma.chat.update({
			where,
			data: { isDeleted: true },
		});
	}
}
