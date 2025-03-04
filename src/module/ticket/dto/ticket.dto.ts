import { IsBoolean, IsDate, IsEnum, IsNumber, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ETicketStatus, EUserType } from "@prisma/client";
import { ITicket } from '../interfaces/ticket.prisma.interface';
import { TicketMessageDto } from '../../ticketMessage/dto/ticket-message.dto';

export class TicketDto {
	public constructor(ticket: ITicket, userId?: number, userType?: EUserType) {
		this.id = ticket.id;
		this.status = ticket.status;
		this.created = ticket.createdAt;

		if (userId) {
			this.waiting =
				ticket.messages !== undefined && ticket.messages.length > 0
					? ticket.messages[ticket.messages.length - 1].isRead === false &&
					ticket.messages[ticket.messages.length - 1].userId !== userId
					: false;
			this.notRead =
				ticket.messages !== undefined && ticket.messages.length > 0
					? ticket.messages.filter((message) => {
						return message.isRead === false && message.userId !== userId;
					}).length
					: 0;
		} else {
			this.waiting = false;
			this.notRead = 0;
		}

		this.messages =
			ticket.messages !== undefined && ticket.messages.length > 0
				? ticket.messages.map((message) => {
					return new TicketMessageDto(message);
				})
				: null;
	}

	@IsNumber()
	@Expose({ name: 'id' })
	@ApiProperty({
		title: 'ID чата (пользователя)',
		description: 'ID чата (пользователя)',
		type: Number,
		format: 'int32',
	})
	id: number;

	@IsNumber()
	@Expose({ name: 'assigned' })
	@ApiProperty({
		title: 'ID менеджера, кто взял в работу)',
		description: 'ID менеджера, кто взял в работу)',
		type: Number,
		format: 'int32',
	})
	assigned: number;

	@IsEnum(ETicketStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус тикета',
		enum: ETicketStatus,
	})
	status: ETicketStatus;

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

	@IsBoolean()
	@Expose({ name: 'waiting' })
	@ApiProperty({
		title: 'Метка ожидания ответа от меня',
		description: 'Метка ожидания ответа от меня',
		type: Boolean,
	})
	waiting: boolean;

	@ValidateNested({ each: true })
	@Type(() => TicketMessageDto)
	@Expose({ name: 'messages' })
	@ApiProperty({
		title: 'Список сообщений',
		description: 'Список сообщений чата',
		isArray: true,
		type: TicketMessageDto,
	})
	messages: TicketMessageDto[];
}
