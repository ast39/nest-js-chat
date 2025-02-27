import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WsChatReadDto {
	@IsNotEmpty()
	@IsNumber()
	chatId: number;

	@IsNotEmpty()
	@IsString()
	readerId: number;
}
