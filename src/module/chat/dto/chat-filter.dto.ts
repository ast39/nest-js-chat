import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EChatStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ChatFilterDto extends PaginationDto {
	@IsOptional()
	@IsNumber()
	@Transform(({ value }) => (value !== undefined && value !== null ? parseInt(value, 10) : undefined))
	@Expose({ name: 'orderId' })
	@ApiProperty({
		title: 'ID заказа',
		description: 'ID заказа',
		type: Number,
		format: 'int32',
		required: false,
	})
	orderId?: number;

	@IsOptional()
	@IsString()
	@Expose({ name: 'title' })
	@ApiProperty({
		title: 'Название',
		description: 'чата жалобы',
		type: String,
		required: false,
	})
	title?: string;

	@IsOptional()
	@IsEnum(EChatStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус чата',
		enum: EChatStatus,
		required: false,
	})
	status?: EChatStatus;
}
