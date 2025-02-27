import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	try {
		console.log('Was run successfully.');
	} catch (e) {
		console.error('Error detected:', e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
