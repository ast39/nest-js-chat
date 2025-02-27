import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EMessageStatus, EUserType } from '@prisma/client';

export class MessageCreateDto {
	@IsNotEmpty()
	@IsNumber()
	@Expose({ name: 'chatId' })
	@ApiProperty({
		title: 'ID чата',
		description: 'ID чата',
		type: Number,
		format: 'int32',
		required: true,
	})
	chatId: number;

	@IsOptional()
	@IsNumber()
	@Expose({ name: 'replyTo' })
	@ApiProperty({
		title: 'Цитируемое сообщение',
		description: 'Цитируемое сообщение',
		type: Number,
		format: 'int32',
		default: null,
		required: false,
	})
	replyTo?: number | null;

	@IsOptional()
	@IsEnum(EUserType)
	@Expose({ name: 'userType' })
	@ApiProperty({
		title: 'Тип автора сообщения',
		description: 'Тип автора сообщения',
		enum: EUserType,
		required: false,
		default: EUserType.ADMIN,
	})
	userType?: EUserType;

	@IsOptional()
	@IsString()
	@Expose({ name: 'content' })
	@ApiProperty({
		title: 'Текст сообщения',
		description: 'Текст сообщения',
		type: String,
		required: false,
	})
	content?: string;

	@IsOptional()
	@IsEnum(EMessageStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус сообщения',
		enum: EMessageStatus,
		required: false,
		default: EMessageStatus.ACTIVE,
	})
	status?: EMessageStatus;
}
