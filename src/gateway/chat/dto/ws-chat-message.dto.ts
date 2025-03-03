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

	@IsOptional()
	@IsEnum(EUserType)
	userType?: EUserType;

	@IsOptional()
	@IsNumber()
	replyTo?: number;
}
