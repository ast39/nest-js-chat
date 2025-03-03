import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EUserType } from '@prisma/client';

export class WsTicketMessageDto {
	@IsNotEmpty()
	@IsNumber()
	ticketId: number;

	@IsNotEmpty()
	@IsNumber()
	userId: number;

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
