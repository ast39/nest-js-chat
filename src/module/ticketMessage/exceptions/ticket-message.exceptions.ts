import { HttpException, HttpStatus } from '@nestjs/common';

export class TicketMessageNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Сообщение не найдено' }, HttpStatus.NOT_FOUND);
	}
}
