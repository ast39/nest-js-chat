import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	const payload = request.user;

	return data ? payload?.[data] : payload;
});
