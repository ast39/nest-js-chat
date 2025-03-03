import { HttpException, HttpStatus } from '@nestjs/common';

export class TicketNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Тикет не найден' }, HttpStatus.NOT_FOUND);
	}
}

export class TicketDoubleException extends HttpException {
	constructor() {
		super({ message: 'Такой тикет уже создан' }, HttpStatus.BAD_REQUEST);
	}
}

export class TicketInProgressException extends HttpException {
	constructor() {
		super({ message: 'Тикетом уже занимается другой менеджер' }, HttpStatus.BAD_REQUEST);
	}
}

export class TicketIsCloseException extends HttpException {
	constructor() {
		super({ message: 'Тикет уже закрыт' }, HttpStatus.BAD_REQUEST);
	}
}

export class UserNotAccessException extends HttpException {
	constructor() {
		super({ message: 'У Вас нет прав на выполнение этого действия' }, HttpStatus.NOT_FOUND);
	}
}
