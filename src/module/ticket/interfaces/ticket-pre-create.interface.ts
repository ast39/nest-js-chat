import { EChatStatus, ETicketStatus } from "@prisma/client";

export class ITicketPreCreate {
	userId: number;
	status?: ETicketStatus;
}
