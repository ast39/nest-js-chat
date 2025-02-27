import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NoTokenFoundException } from '../exceptions/http-error-exception';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor() {}

	async use(req: any, res: any, next: () => void) {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new NoTokenFoundException();
		}

		try {
			const token = authHeader.split(' ')[1].trim();
			const jwtService = new JwtService();
			const payload = jwtService.decode(token);

			// Хак для включения админа
			// payload.isAdmin = true;

			// Хак для авторизации под любым юзером
			// payload.id = 5;

			req.user = payload;

			next();
		} catch {
			throw new UnauthorizedException('Invalid token');
		}
	}
}
