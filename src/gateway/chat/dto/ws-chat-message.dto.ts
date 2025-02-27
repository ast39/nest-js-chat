import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EUserType } from '@prisma/client';

export class WsChatMessageDto {
	@IsNotEmpty()
	@IsNumber()
	chatId: number;

	@IsNotEmpty()
	@IsNumber()
	senderId: number;

	@IsNotEmpty()
	@IsString()
	content: string;

	@IsNotEmpty()
	@IsEnum(EUserType)
	userType?: EUserType;

	@IsOptional()
	@IsNumber()
	replyTo?: number;
}
