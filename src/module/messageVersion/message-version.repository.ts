import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import {
	IMessageVersionFilter,
	IMessageVersionOrder,
	IMessageVersionUnique,
} from './interfaces/message-version.prisma.interface';
import { MessageVersionCreateDto } from './dto/message-version.create.dto';
import { MessageVersion } from '@prisma/client';
@Injectable()
export class MessageVersionRepository {
	constructor(private prisma: PrismaService) {}

	// Всего сообщений без пагинации
	async totalRows(
		params: {
			cursor?: IMessageVersionUnique;
			where?: IMessageVersionFilter;
		},
		tx?: IPrismaTR,
	): Promise<number> {
		const { cursor, where } = params;
		const prisma = tx ?? this.prisma;

		return prisma.messageVersion.count({
			cursor,
			where,
		});
	}

	// Список сообщений
	async index(
		params: {
			skip?: number;
			take?: number;
			where?: IMessageVersionFilter;
			orderBy?: IMessageVersionOrder;
		},
		tx?: IPrismaTR,
	): Promise<MessageVersion[]> {
		const { skip, take, where, orderBy } = params;
		const prisma = tx ?? this.prisma;

		return prisma.messageVersion.findMany({
			skip,
			take,
			where,
			orderBy,
		});
	}

	// Сообщение по ID
	async show(messageVersionId: number, tx?: IPrismaTR): Promise<MessageVersion> {
		const prisma = tx ?? this.prisma;

		return prisma.messageVersion.findUnique({
			where: { id: +messageVersionId },
		});
	}

	// Добавить сообщение
	async store(data: MessageVersionCreateDto, tx?: IPrismaTR): Promise<MessageVersion> {
		const prisma = tx ?? this.prisma;

		return prisma.messageVersion.create({
			data: {
				messageId: +data.messageId,
				content: data.content,
			},
		});
	}
}
