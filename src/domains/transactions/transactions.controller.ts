import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { TransactionsService } from './transactions.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { TransactionType } from './models/transaction-type.model';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('/card-deposit')
  createDepositSession(@Body() body: any, @CurrentUser() user: User) {
    return this.transactionsService.makeDepositSession(
      body.accountNumber,
      body.amount,
      user,
    );
  }

  @UseGuards(AdminGuard)
  @Post('/deposit')
  createDeposit(@CurrentUser() user: User, @Body() body: any) {
    return this.transactionsService.makeCashOperation(
      body.accountNumber,
      body.depositAmount,
      user,
      TransactionType.DEPOSIT,
    );
  }

  @UseGuards(AdminGuard)
  @Post('/withdraw')
  createWithdraw(@CurrentUser() user: User, @Body() body: any) {
    return this.transactionsService.makeCashOperation(
      body.accountNumber,
      body.withdrawAmount,
      user,
      TransactionType.WITHDRAW,
    );
  }

  @Post('/transfer')
  transferToAnotherAccount(@CurrentUser() user: User, @Body() body: any) {
    return this.transactionsService.makeTransferOperation(
      body.from,
      body.to,
      body.amount,
      user,
    );
  }

  @Get('/success-deposit')
  async validatePaymentSession(@Query('sid') sid: string) {
    return this.transactionsService.validatePayment(sid);
  }
}
