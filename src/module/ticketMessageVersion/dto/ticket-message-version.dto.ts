import { IsDate, IsNumber, IsString } from "class-validator";
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ITicketMessageVersion } from '../interfaces/ticket-message-version.prisma.interface';

export class TicketMessageVersionDto {
	public constructor(version: ITicketMessageVersion) {
		this.id = version.id;
		this.messageId = version.messageId;
		this.content = version.content;
		this.created = version.createdAt;
	}

	@IsNumber()
	@Expose({ name: 'id' })
	@ApiProperty({
		title: 'ID версии сообщения',
		description: 'ID версии сообщения',
		type: Number,
		format: 'int32',
	})
	id: number;

	@IsNumber()
	@Expose({ name: 'messageId' })
	@ApiProperty({
		title: 'ID сообщения',
		description: 'ID сообщения',
		type: Number,
		format: 'int32',
	})
	messageId: number;

	@IsString()
	@Expose({ name: 'content' })
	@ApiProperty({
		title: 'Текст сообщения',
		description: 'Текст сообщения',
		type: String,
	})
	content: string;

	@IsDate()
	@Expose({ name: 'created' })
	@ApiProperty({
		title: 'Время добавления',
		description: 'Время добавления жалобы',
		type: Date,
	})
	created: Date;
}
