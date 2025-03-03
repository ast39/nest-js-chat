import { HttpException, HttpStatus } from '@nestjs/common';

export class TicketMessageVersionNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Версия сообщения не найдена' }, HttpStatus.NOT_FOUND);
	}
}

export class TicketMessageVersionNotYourException extends HttpException {
	constructor() {
		super({ message: 'Это чужое сообщение' }, HttpStatus.BAD_REQUEST);
	}
}
