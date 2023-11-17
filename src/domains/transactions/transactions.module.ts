import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { StripeService } from 'src/shared/services/stripe.service';
import { CustomConfigService } from 'src/shared/services/custom-config.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/account.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { HashService } from 'src/shared/services/hash.service';

@Module({
  imports: [
    HttpModule.register({}),
    TypeOrmModule.forFeature([Transaction, Account, User]),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    StripeService,
    CustomConfigService,
    AccountsService,
    UsersService,
    HashService,
  ],
})
export class TransactionsModule {}
