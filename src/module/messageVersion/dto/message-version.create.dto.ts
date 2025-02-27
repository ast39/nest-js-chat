import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MessageVersionCreateDto {
	@IsNotEmpty()
	@IsNumber()
	@Expose({ name: 'messageId' })
	@ApiProperty({
		title: 'ID сообщения',
		description: 'ID сообщения',
		type: Number,
		format: 'int32',
		required: true,
	})
	messageId: number;

	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'content' })
	@ApiProperty({
		title: 'Текст сообщения',
		description: 'Текст сообщения',
		type: String,
		required: true,
	})
	content: string;
}
