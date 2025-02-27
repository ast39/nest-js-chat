import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import { IMessageFilter, IMessageOrder, IMessageUnique } from './interfaces/message.prisma.interface';
import { MessageUpdateDto } from './dto/message.update.dto';
import { MessageCreateDto } from './dto/message.create.dto';
import { Message, EMessageStatus } from '@prisma/client';
import { EBooleanStatus } from '../../common/enums/boolean-status.enum';

@Injectable()
export class MessageRepository {
	constructor(private prisma: PrismaService) {}

	// Всего сообщений без пагинации
	async totalRows(params: { cursor?: IMessageUnique; where?: IMessageFilter }, tx?: IPrismaTR): Promise<number> {
		const { cursor, where } = params;
		const prisma = tx ?? this.prisma;

		return prisma.message.count({ cursor, where });
	}

	// Список сообщений
	async index(
		params: { skip?: number; take?: number; where?: IMessageFilter; orderBy?: IMessageOrder },
		tx?: IPrismaTR,
	): Promise<Message[]> {
		const { skip, take, where, orderBy } = params;
		const prisma = tx ?? this.prisma;

		return prisma.message.findMany({ skip, take, where, orderBy });
	}

	// Сообщение по ID
	async show(messageId: number, tx?: IPrismaTR): Promise<Message> {
		const prisma = tx ?? this.prisma;

		return prisma.message.findUnique({
			where: { id: +messageId },
		});
	}

	// Добавить сообщение
	async store(userId: number, data: MessageCreateDto, tx?: IPrismaTR): Promise<Message> {
		const prisma = tx ?? this.prisma;

		return prisma.message.create({
			data: {
				chatId: +data.chatId,
				replyToId: +data.replyTo || null,
				userId: userId,
				content: data.content ?? '',
				status: data.status || EMessageStatus.ACTIVE,
			},
		});
	}

	// Обновить сообщение
	async update(params: { where: IMessageUnique; data: MessageUpdateDto }, tx?: IPrismaTR): Promise<Message> {
		const { where, data } = params;
		const prisma = tx ?? this.prisma;

		return prisma.message.update({ where, data });
	}

	// Удалить сообщение (мягкое удаление)
	async destroy(where: IMessageUnique, tx?: IPrismaTR): Promise<Message> {
		const prisma = tx ?? this.prisma;

		return prisma.message.update({
			where,
			data: { isDeleted: true },
		});
	}

	// Прочитать сообщения чата
	async readMessages(chatId: number, userId: number, tx?: IPrismaTR): Promise<number> {
		const prisma = tx ?? this.prisma;
		const result = await prisma.message.updateMany({
			where: { id: chatId, NOT: { userId: userId } },
			data: { isRead: true },
		});

		return result.count;
	}
}
