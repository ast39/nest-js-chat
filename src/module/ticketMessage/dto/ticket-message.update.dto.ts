import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EMessageStatus, EUserType } from '@prisma/client';

export class TicketMessageUpdateDto {
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
	})
	content?: string;

	@IsOptional()
	@IsEnum(EMessageStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус жалобы',
		enum: EMessageStatus,
		required: false,
		default: EMessageStatus.ACTIVE,
	})
	status?: EMessageStatus;
}
