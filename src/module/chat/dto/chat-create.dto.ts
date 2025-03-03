import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EChatStatus } from '@prisma/client';

export class ChatCreateDto {
	@IsNotEmpty()
	@IsNumber()
	@Expose({ name: 'publicationId' })
	@ApiProperty({
		title: 'ID публикации',
		description: 'ID публикации',
		type: Number,
		format: 'int32',
		required: true,
	})
	publicationId: number;

	@IsNotEmpty()
	@IsNumber()
	@Expose({ name: 'publisherId' })
	@ApiProperty({
		title: 'ID паблишера',
		description: 'ID паблишера',
		type: Number,
		format: 'int32',
		required: true,
	})
	publisherId: number;

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
