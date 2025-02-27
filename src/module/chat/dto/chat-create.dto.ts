import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EChatStatus } from '@prisma/client';

export class ChatCreateDto {
	@IsNotEmpty()
	@IsNumber()
	@Expose({ name: 'orderId' })
	@ApiProperty({
		title: 'ID заказа',
		description: 'ID заказа',
		type: Number,
		format: 'int32',
		required: true,
	})
	orderId: number;

	@IsNotEmpty()
	@IsNumber()
	@Expose({ name: 'sellerId' })
	@ApiProperty({
		title: 'ID продавца',
		description: 'ID продавца',
		type: Number,
		format: 'int32',
		required: true,
	})
	sellerId: number;

	@IsOptional()
	@IsEnum(EChatStatus)
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Статус',
		description: 'Статус чата',
		enum: EChatStatus,
		required: false,
		default: EChatStatus.ACTIVE,
	})
	status?: EChatStatus;
}
