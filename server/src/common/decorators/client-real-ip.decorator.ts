import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as requestIp from 'request-ip';

export const ClientIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    if (request.headers['cf-connecting-ip'])
      //* cloudflare origin ip */
      return request.headers['cf-connecting-ip'];
    else return requestIp.getClientIp(request);
  },
);
