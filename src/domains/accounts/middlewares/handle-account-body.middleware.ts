import {
  BadRequestException,
  ForbiddenException,
  Inject,
  NestMiddleware,
} from '@nestjs/common';
import {
  instanceToPlain,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { User } from 'src/domains/users/user.entity';
import { UsersService } from 'src/domains/users/users.service';
import { CreateAccountDTO } from '../dtos/create-account.dto';
import { Account } from '../account.entity';

export class HandleAccountBodyMiddleware implements NestMiddleware {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const user: User = req['user'];

    if (!user) throw new ForbiddenException('forbidden');

    const adto = plainToInstance(CreateAccountDTO, req.body, {
      excludeExtraneousValues: true,
    });

    const errors = await validate(adto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const accountPlain = instanceToPlain(adto);

    if (user.admin && !accountPlain.ownerId)
      throw new BadRequestException('ownerId must be defiend');

    const owner: User = user.admin
      ? await this.usersService.findOneBy({
          where: { id: accountPlain.ownerId },
        })
      : user;

    if (!owner) throw new BadRequestException('please provide a vlid ownerId');

    accountPlain.owner = owner;
    accountPlain.createdBy = user;
    accountPlain.accountNumber = Date.now() + '';
    accountPlain.isActive = user.admin && req.body.isActive;

    req['createdAccount'] = plainToClass(Account, accountPlain);

    next();
  }
}
