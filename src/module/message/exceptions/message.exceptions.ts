import { HttpException, HttpStatus } from '@nestjs/common';

export class MessageNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Сообщение не найдено' }, HttpStatus.NOT_FOUND);
	}
}
