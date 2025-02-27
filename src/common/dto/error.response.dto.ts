import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class ErrorResponseDto {
	public constructor(status: number, msg: string) {
		this.status = status ?? 500;
		this.msg = msg ?? 'Ошибка сервера';
	}

	@IsNumber()
	@IsNotEmpty()
	@Expose({ name: 'status' })
	@ApiProperty({
		title: 'Код ошибки',
		description: 'Код ошибки',
		type: Number,
		default: 500,
	})
	status: number = 500;

	@IsString()
	@IsNotEmpty()
	@Expose({ name: 'msg' })
	@ApiProperty({
		title: 'Текст ошибки',
		description: 'Текст ошибки',
		type: String,
		default: 500,
	})
	msg: string = 'Ошибка сервера';
}
