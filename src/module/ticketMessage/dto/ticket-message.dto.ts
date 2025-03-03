import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ITicketMessage } from '../interfaces/ticket-message.prisma.interface';
import { EMessageStatus, EUserType } from '@prisma/client';

export class TicketMessageDto {
	public constructor(message: ITicketMessage) {
		this.messageId = message.id;
		this.ticketId = message.ticketId;
		this.replyTo = message.replyToId;
		this.userId = message.userId;
		this.userType = message.userType;
		this.content = message.content;
		this.isRead = message.isRead;
		this.status = message.status;
		this.created = message.createdAt;
	}

	@IsNumber()
	@Expose({ name: 'messageId' })
	@ApiProperty({
		title: 'ID сообщения',
		description: 'ID сообщения',
		type: Number,
		format: 'int32',
	})
	messageId: number;

	@IsNumber()
	@Expose({ name: 'ticketId' })
	@ApiProperty({
		title: 'ID тикета',
		description: 'ID тикета',
		type: Number,
		format: 'int32',
	})
	ticketId: number;

	@IsNumber()
	@Expose({ name: 'replyTo' })
	@ApiProperty({
		title: 'Цитируемое сообщение',
		description: 'Цитируемое сообщение',
		type: Number,
		format: 'int32',
	})
	replyTo?: number | null;

	@IsString()
	@Expose({ name: 'userId' })
	@ApiProperty({
		title: 'ID автора',
		description: 'ID автора сообщения',
		type: Number,
		format: 'int32',
	})
	userId: number;

	@IsEnum(EUserType)
	@Expose({ name: 'userType' })
	@ApiProperty({
		title: 'Тип автора сообщения',
		description: 'Тип автора сообщения',
		enum: EUserType,
	})
	userType?: EUserType;

	@IsString()
	@Expose({ name: 'content' })
	@ApiProperty({
		title: 'Текст сообщения',
		description: 'Текст сообщения',
		type: String,
	})
	content: string;

	@IsNumber()
	@Expose({ name: 'isRead' })
	@ApiProperty({
		title: 'Метка прочтения сообщения',
		description: 'Метка прочтения сообщения',
		type: Boolean,
	})
	isRead: boolean;

	@IsEnum(EMessageStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус сообщения',
		enum: EMessageStatus,
		required: false,
	})
	status: EMessageStatus;

	@IsDate()
	@Expose({ name: 'created' })
	@ApiProperty({
		title: 'Время добавления',
		description: 'Время добавления сообщения',
		type: Date,
	})
	created: Date;
}
