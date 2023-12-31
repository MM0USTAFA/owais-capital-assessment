import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreatedAccount } from './decorators/created-account.decorator';
import { Account } from './account.entity';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { AccountDTO } from './dtos/account.dto';
import { PgFilterService } from 'src/shared/services/pg-filter.service';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { FindOneOptions } from 'typeorm';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateAccountDTO } from './dtos/create-account.dto';
import { QueryDTO } from 'src/shared/dtos/query.dto';

@Controller({
  path: 'accounts',
  version: ['1'],
})
@Serialize(AccountDTO)
@ApiTags('accounts')
@ApiBearerAuth('Authorization')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post()
  createAccount(
    @Body() body: CreateAccountDTO,
    @CreatedAccount() account: Account,
  ) {
    return this.accountsService.create(account);
  }

  @Get()
  @UseGuards(AdminGuard)
  getAccounts(@Query() query: QueryDTO) {
    const findOptions = new PgFilterService(query).exec();
    return this.accountsService.findMany(findOptions);
  }

  @Get('/id/:id')
  getAccountById(
    @Param('id') id: string,
    @Query('popFields') popFields: string,
    @CurrentUser() currentUser: User,
  ) {
    const findOptions: FindOneOptions = new PgFilterService({
      popFields,
    }).populate().findManyOptions;

    return this.accountsService.findOneBy({
      where: {
        id,
        owner: currentUser.admin ? undefined : { id: currentUser.id },
      },
      ...findOptions,
    } as FindOneOptions);
  }

  @Get('/acn/:accountNumber')
  getAccountByACN(
    @Param('accountNumber') accountNumber: string,
    @Query('popFields') popFields: string,
    @CurrentUser() currentUser: User,
  ) {
    const findOptions: FindOneOptions = new PgFilterService({
      popFields,
    }).populate().findManyOptions;

    return this.accountsService.findOneBy({
      where: {
        accountNumber,
        owner: currentUser.admin ? undefined : { id: currentUser.id },
      },
      ...findOptions,
    } as FindOneOptions);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBody({
    schema: { default: { isActive: false } },
  })
  updateAccountStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    if (typeof isActive !== 'boolean')
      throw new BadRequestException('isActive must be boolean');

    return this.accountsService.update(+id, { isActive } as any);
  }
}
