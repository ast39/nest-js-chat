import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EMessageStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class TicketMessageFilterDto extends PaginationDto {
	@IsOptional()
	@IsNumber()
	@Transform(({ value }) => (value !== undefined && value !== null ? parseInt(value, 10) : undefined))
	@Expose({ name: 'ticketId' })
	@ApiProperty({
		title: 'ID тикета',
		description: 'ID тикета',
		type: Number,
		format: 'int32',
	})
	ticketId?: number;

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
