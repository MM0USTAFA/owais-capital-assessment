import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Account } from '../account.entity';

export const CreatedAccount = createParamDecorator(
  (data: never, contenxt: ExecutionContext) => {
    const request = contenxt.switchToHttp().getRequest();
    return request['createdAccount'] as Account;
  },
);
