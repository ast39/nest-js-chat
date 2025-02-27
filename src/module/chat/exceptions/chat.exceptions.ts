import { HttpException, HttpStatus } from '@nestjs/common';

export class ChatNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Чат не найден' }, HttpStatus.NOT_FOUND);
	}
}

export class ChatDoubleException extends HttpException {
	constructor() {
		super({ message: 'Такой чат уже создан' }, HttpStatus.BAD_REQUEST);
	}
}

export class UserNotAccessException extends HttpException {
	constructor() {
		super({ message: 'У Вас нет прав на выполнение этого действия' }, HttpStatus.NOT_FOUND);
	}
}
