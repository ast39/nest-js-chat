import { IsNumber, IsOptional } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class MessageVersionFilterDto extends PaginationDto {
	@IsOptional()
	@IsNumber()
	@Transform(({ value }) => (value !== undefined && value !== null ? parseInt(value, 10) : undefined))
	@Expose({ name: 'messageId' })
	@ApiProperty({
		title: 'ID сообщения',
		description: 'ID сообщения',
		type: Number,
		format: 'int32',
		required: false,
	})
	messageId?: number;
}
