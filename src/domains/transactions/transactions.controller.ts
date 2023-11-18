import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { TransactionsService } from './transactions.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { TransactionType } from './models/transaction-type.model';
import { PgFilterService } from 'src/shared/services/pg-filter.service';
import { DropWithDTO } from './dtos/deop-with.dto';
import { TransferDTO } from './dtos/transfer.dto';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { TransactionDTO } from './dtos/transaction.dto';
import { QueryDTO } from 'src/shared/dtos/query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('transactions')
@ApiTags('transactions')
@ApiBearerAuth('Authorization')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('/card-deposit')
  createDepositSession(@Body() body: DropWithDTO, @CurrentUser() user: User) {
    return this.transactionsService.makeDepositSession(
      body.accountNumber,
      body.amount,
      user,
    );
  }

  @UseGuards(AdminGuard)
  @Post('/deposit')
  createDeposit(@Body() body: DropWithDTO, @CurrentUser() user: User) {
    return this.transactionsService.makeCashOperation(
      body.accountNumber,
      body.amount,
      user,
      TransactionType.DEPOSIT,
    );
  }

  @UseGuards(AdminGuard)
  @Post('/withdraw')
  createWithdraw(@Body() body: DropWithDTO, @CurrentUser() user: User) {
    return this.transactionsService.makeCashOperation(
      body.accountNumber,
      body.amount,
      user,
      TransactionType.WITHDRAW,
    );
  }

  @Post('/transfer')
  transferToAnotherAccount(
    @Body() body: TransferDTO,
    @CurrentUser() user: User,
  ) {
    return this.transactionsService.makeTransferOperation(
      body.from,
      body.to,
      body.amount,
      user,
    );
  }

  @Get('/:acn')
  @Serialize(TransactionDTO)
  getTransactions(
    @Param('acn') accountNumber: string,
    @Query() query: QueryDTO,
    @CurrentUser() user: User,
  ) {
    if (!accountNumber)
      throw new BadRequestException('accountNumber is required');

    query.popFields = `${
      (query.popFields ?? '') && query.popFields + ','
    }from.owner,to.owner`;
    const findOptions = new PgFilterService(query).exec();
    return this.transactionsService.getHistory(
      findOptions,
      accountNumber,
      user,
    );
  }

  @Get('/success-deposit')
  async validatePaymentSession(@Query('sid') sid: string) {
    return this.transactionsService.validatePayment(sid);
  }
}
