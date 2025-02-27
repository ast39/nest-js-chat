import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { MessageVersionCreateDto } from './dto/message-version.create.dto';
import { MessageVersionDto } from './dto/message-version.dto';
import { MessageVersionRepository } from './message-version.repository';
import { MessageVersionFilterDto } from './dto/message-version.filter.dto';
import { MessageVersionNotFoundException } from './exceptions/message-version.exceptions';
import { IMessageVersionFilter } from './interfaces/message-version.prisma.interface';

@Injectable()
export class MessageVersionService {
	constructor(
		private prisma: PrismaService,
		private messageVersionRepo: MessageVersionRepository,
	) {}

	/**
	 * Получение списка сообщений архива
	 *
	 * @param url
	 * @param messageVersionFilter
	 */
	async messageVersionList(
		url: string,
		messageVersionFilter: MessageVersionFilterDto,
	): Promise<PaginationInterface<MessageVersionDto>> {
		const page = Number(messageVersionFilter.page ?? 1);
		const limit = Number(messageVersionFilter.limit ?? 10);
		const whereCondition: IMessageVersionFilter = {
			messageId: messageVersionFilter.messageId || undefined,
		};

		// Список сообщений архива
		const [messageVersions, totalRows] = await this.prisma.$transaction(async (tx) => {
			const messageVersions = await this.messageVersionRepo.index(
				{
					skip: (page - 1) * limit,
					take: limit,
					where: whereCondition,
					orderBy: { createdAt: 'desc' },
				},
				tx,
			);

			if (!messageVersions.length) {
				throw new MessageVersionNotFoundException();
			}

			const total = await this.messageVersionRepo.totalRows({ where: whereCondition }, tx);

			return [messageVersions, total];
		});

		return {
			data: messageVersions.map((messageVersion) => new MessageVersionDto(messageVersion)),
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
	 * Получение одного сообщения архива
	 *
	 * @param messageVersionId
	 */
	async getMessageVersion(messageVersionId: number): Promise<MessageVersionDto> {
		return this.prisma.$transaction(async (tx) => {
			const messageVersion = await this.messageVersionRepo.show(+messageVersionId, tx);
			if (!messageVersion) {
				throw new MessageVersionNotFoundException();
			}

			return new MessageVersionDto(messageVersion);
		});
	}

	/**
	 * Создание нового сообщения в архиве
	 *
	 * @param data
	 */
	async createMessageVersion(data: MessageVersionCreateDto): Promise<MessageVersionDto> {
		return this.prisma.$transaction(async (tx) => {
			// Добавим сообщение в архив
			const newMessageVersion = await this.messageVersionRepo.store(data, tx);

			return new MessageVersionDto(newMessageVersion);
		});
	}
}
