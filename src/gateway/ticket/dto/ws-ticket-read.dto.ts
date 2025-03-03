import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { EUserType } from "@prisma/client";

export class WsTicketReadDto {
	@IsNotEmpty()
	@IsNumber()
	ticketId: number;

	@IsNotEmpty()
	@IsEnum(EUserType)
	userType: EUserType;
}
