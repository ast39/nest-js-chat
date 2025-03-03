import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ETicketStatus } from "@prisma/client";

export class TicketCreateDto {
	@IsNotEmpty()
	@IsNumber()
	@Expose({ name: 'userId' })
	@ApiProperty({
		title: 'ID пользователя',
		description: 'ID пользователя',
		type: Number,
		format: 'int32',
		required: true,
	})
	userId: number;

	@IsOptional()
	@IsEnum(ETicketStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус тикета',
		enum: ETicketStatus,
		required: false,
		default: ETicketStatus.OPEN,
	})
	status?: ETicketStatus;
}
