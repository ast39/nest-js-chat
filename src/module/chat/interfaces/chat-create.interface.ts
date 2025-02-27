import { EChatStatus } from '@prisma/client';

export class IChatCreate {
	orderId: number;
	sellerId: number;
	buyerId: number;
	title: string;
	status?: EChatStatus;
}
