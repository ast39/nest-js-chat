import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Bearer = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	const authHeader = request.headers['authorization'];

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return null;
	}

	return authHeader.split(' ')[1];
});
