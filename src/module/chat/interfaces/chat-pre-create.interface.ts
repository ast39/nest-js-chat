import { EChatStatus } from '@prisma/client';

export class IChatPreCreate {
	publicationId: number;
	publisherId: number;
	advertiserId: number;
	title: string;
	status?: EChatStatus;
}
