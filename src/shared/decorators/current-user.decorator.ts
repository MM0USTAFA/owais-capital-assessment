import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, contenxt: ExecutionContext) => {
    const request = contenxt.switchToHttp().getRequest();
    return request['user'];
  },
);
