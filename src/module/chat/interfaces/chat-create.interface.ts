import { EChatStatus } from '@prisma/client';

export class IChatCreate {
	publicationId: number;
	publisherId: number;
	advertiserId: number;
	title: string;
	status?: EChatStatus;
}
