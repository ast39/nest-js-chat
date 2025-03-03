import { IsEnum, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ETicketStatus } from "@prisma/client";
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class TicketFilterDto extends PaginationDto {
	@IsOptional()
	@IsEnum(ETicketStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус чата',
		enum: ETicketStatus,
		required: false,
	})
	status?: ETicketStatus;
}
