import { IsDate, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EChatStatus } from '@prisma/client';
import { IChat } from '../interfaces/chat.prisma.interface';
import { MessageDto } from '../../message/dto/message.dto';

export class ChatDto {
	public constructor(chat: IChat, userId?: number) {
		this.id = chat.id;
		this.orderId = chat.orderId;
		this.title = chat.title;
		if (userId) {
			this.waiting =
				chat.messages !== undefined && chat.messages.length > 0
					? chat.messages[chat.messages.length - 1].isRead === false &&
						chat.messages[chat.messages.length - 1].userId !== userId
					: false;
			this.notRead =
				chat.messages !== undefined && chat.messages.length > 0
					? chat.messages.filter((message) => {
							return message.isRead === true && message.userId !== userId;
						}).length
					: 0;
		} else {
			this.waiting = false;
			this.notRead = 0;
		}
		this.status = chat.status;
		this.created = chat.createdAt;

		this.messages =
			chat.messages !== undefined && chat.messages.length > 0
				? chat.messages.map((message) => {
						return new MessageDto(message);
					})
				: null;
	}

	@IsNumber()
	@Expose({ name: 'id' })
	@ApiProperty({
		title: 'ID чата',
		description: 'ID чата',
		type: Number,
		format: 'int32',
	})
	id: number;

	@IsNumber()
	@Expose({ name: 'orderId' })
	@ApiProperty({
		title: 'ID заказа',
		description: 'ID заказа',
		type: Number,
		format: 'int32',
	})
	orderId: number;

	@IsNumber()
	@Expose({ name: 'sellerId' })
	@ApiProperty({
		title: 'ID продавца',
		description: 'ID продавца',
		type: Number,
		format: 'int32',
	})
	sellerId: number;

	@IsNumber()
	@Expose({ name: 'buyerId' })
	@ApiProperty({
		title: 'ID продавца',
		description: 'ID продавца',
		type: Number,
		format: 'int32',
	})
	buyerId: number;

	@IsString()
	@Expose({ name: 'title' })
	@ApiProperty({
		title: 'Заголовок',
		description: 'Заголовок жалобы',
		type: String,
	})
	title: string;

	@IsString()
	@Expose({ name: 'waiting' })
	@ApiProperty({
		title: 'Метка ожидания ответа от меня',
		description: 'Метка ожидания ответа от меня',
		type: Boolean,
	})
	waiting: boolean;

	@IsEnum(EChatStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус чата',
		enum: EChatStatus,
	})
	status?: EChatStatus;

	@IsDate()
	@Expose({ name: 'created' })
	@ApiProperty({
		title: 'Время добавления',
		description: 'Время добавления жалобы',
		type: Date,
	})
	created: Date;

	@IsNumber()
	@Expose({ name: 'notRead' })
	@ApiProperty({
		title: 'Кол-во непрочитанных сообщений мной',
		description: 'Кол-во непрочитанных сообщений чата мной',
		type: Number,
	})
	notRead: number = 0;

	@ValidateNested({ each: true })
	@Type(() => MessageDto)
	@Expose({ name: 'messages' })
	@ApiProperty({
		title: 'Список сообщений',
		description: 'Список сообщений чата',
		isArray: true,
		type: MessageDto,
	})
	messages: MessageDto[];
}
