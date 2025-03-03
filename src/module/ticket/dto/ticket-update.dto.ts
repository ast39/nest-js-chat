import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ETicketStatus } from "@prisma/client";

export class TicketUpdateDto {
	@IsOptional()
	@IsNumber()
	@Expose({ name: 'assigned' })
	@ApiProperty({
		title: 'ID менеджера, кто взял в работу)',
		description: 'ID менеджера, кто взял в работу)',
		type: Number,
		format: 'int32',
		required: false,
	})
	assigned?: number;

	@IsOptional()
	@IsEnum(ETicketStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус тикета',
		enum: ETicketStatus,
		required: false,
	})
	status?: ETicketStatus;
}
