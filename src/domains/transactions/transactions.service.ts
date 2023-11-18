import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction as TransEntity } from './transaction.entity';
import { StripeService } from 'src/shared/services/stripe.service';
import { AccountsService } from '../accounts/accounts.service';
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  In,
  Repository,
} from 'typeorm';
import { TransactionStatus } from './models/transaction-status.model';
import { TransactionType } from './models/transaction-type.model';
import { User } from '../users/user.entity';
import { CRUDService } from 'src/shared/services/crud.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TransactionsService extends CRUDService<TransEntity> {
  constructor(
    @InjectRepository(TransEntity) private trepo: Repository<TransEntity>,
    @Inject(UsersService) private usersService: UsersService,
    private dataSource: DataSource,
    private stripeService: StripeService,
    private accountsService: AccountsService,
  ) {
    super(trepo);
  }

  async makeDepositSession(
    accountNumber: string,
    depositAmount: number,
    user: User,
  ) {
    const account = await this.accountsService.findOneBy({
      where: { accountNumber },
      relations: { owner: true },
    });

    if (account.owner.id !== user.id)
      throw new UnauthorizedException(
        "you can't make a deposit session to any account but for yours only",
      );
    const session = await this.stripeService.checkoutSession(depositAmount);

    // add transaction id to the queue of cron jobs

    await this.create({
      status: TransactionStatus.PENDING,
      to: account,
      transactionType: TransactionType.DEPOSIT,
      createdBy: user,
      depositSession: session.id,
      amount: depositAmount,
    });

    return session.url;
  }

  async makeCashOperation(
    accountNumber: string,
    amount: number,
    admin: User,
    transType: TransactionType,
  ) {
    const account = await this.accountsService.findOneBy({
      where: { accountNumber },
      relations: { owner: true },
    });

    if (!account.isActive)
      throw new BadRequestException(
        'your account is inactive please contact your issuer',
      );

    if (transType === TransactionType.WITHDRAW && +account.balance < amount)
      throw new BadRequestException('insufficient funds');

    const moneyWay = transType === TransactionType.WITHDRAW ? 'from' : 'to';

    await this.dataSource.transaction(async (manager: EntityManager) => {
      const transaction = this.trepo.create({
        status: TransactionStatus.SUCCESS,
        [moneyWay]: account,
        transactionType: transType,
        createdBy: admin,
        amount,
      });

      const opeAmount =
        transType === TransactionType.WITHDRAW ? amount * -1 : amount;
      account.balance = +account.balance + +opeAmount;

      await manager.save([transaction, account]);
    });
    const amountKey =
      transType === TransactionType.WITHDRAW
        ? 'withdrawAmount'
        : 'depositAmount';

    return {
      message: `your ${transType} has been successfully`,
      [amountKey]: amount.toFixed(2) + 'SAR',
      currentBalance: account.balance.toFixed(2) + 'SAR',
    };
  }

  async makeTransferOperation(
    fromAccountNumber: string,
    toAccountNumber: string,
    amount: number,
    user: User,
  ) {
    if (fromAccountNumber === toAccountNumber)
      throw new BadRequestException(
        `you can't make transfer from and to the same account`,
      );

    const accounts = await this.accountsService.findMany({
      where: { accountNumber: In([fromAccountNumber, toAccountNumber]) },
      relations: { owner: true },
    });

    if (accounts.length !== 2) throw new NotFoundException();

    if (!accounts[0].isActive || !accounts[1].isActive)
      return new BadRequestException(
        'one of the two accounts is inactive please call the issuer',
      );

    const fromAccount = accounts.find((account) => {
      return user.admin
        ? account.accountNumber === fromAccountNumber
        : account.owner.id === user.id;
    });

    const toAccount = accounts.find(
      ({ accountNumber }) => accountNumber === toAccountNumber,
    );

    if (!fromAccount)
      throw new ForbiddenException(`you can only transfer from yours accounts`);

    if (fromAccount.balance < amount)
      throw new BadRequestException('insufficient balance to transfer from');

    await this.dataSource.transaction(async (manager: EntityManager) => {
      const transaction = this.trepo.create({
        status: TransactionStatus.SUCCESS,
        from: fromAccount,
        to: toAccount,
        transactionType: TransactionType.TRANSFER,
        createdBy: user,
        amount,
      });

      fromAccount.balance = +fromAccount.balance - +amount;
      toAccount.balance = +toAccount.balance + +amount;

      await manager.save([transaction, fromAccount, toAccount]);
    });

    return {
      message: `your transfer has been successfully`,
      transferAmount: amount.toFixed(2) + 'SAR',
      transferedTo: toAccountNumber,
      currentBalance: fromAccount.balance.toFixed(2) + 'SAR',
    };
  }

  async validatePayment(sid: string) {
    const session = await this.stripeService.retrieveSession(sid);
    switch (session.status) {
      case 'open':
        return {
          message: `you didn't complete your payment you can make it from the next url`,
          url: session.url,
        };
      case 'expired':
        await this.updateTransaction(session.id, TransactionStatus.EXPIRED);
        return {
          message: `your session has been expired please back and make another one`,
        };
      case 'complete':
        const trans = await this.updateTransaction(
          session.id,
          TransactionStatus.SUCCESS,
        );
        const account = await this.makeDeposit(
          trans.to.accountNumber,
          session.amount_subtotal / 100,
        );
        return {
          message: 'your deposit has been successfully',
          depositAmount: (session.amount_subtotal / 100).toFixed(2) + 'SAR',
          currentBalance: account.balance.toFixed(2) + 'SAR',
        };
    }
  }

  async getHistory(query: FindManyOptions, accountNumber: string, user: User) {
    const account = await this.accountsService.findOneBy({
      where: { accountNumber },
      relations: { owner: true },
    });

    if (!user.admin && user.id !== account.owner.id) {
      throw new ForbiddenException(
        `you can only see the transactions of your account`,
      );
    }
    query.where =
      query.where instanceof Array
        ? [
            ...query.where,
            { from: { accountNumber } },
            { to: { accountNumber } },
          ]
        : [
            { ...query.where, from: { accountNumber } },
            { ...query.where, to: { accountNumber } },
          ];
    console.log(query);

    return this.findMany(query);
  }

  private async makeDeposit(accountNumber: string, depositAmount: number) {
    const account = await this.accountsService.findOneBy({
      where: { accountNumber },
    });

    account.balance = +account.balance + +depositAmount;
    return this.accountsService.save(account);
  }

  private async updateTransaction(sid: string, status: TransactionStatus) {
    const trans = await this.findOneBy({
      where: { depositSession: sid },
      relations: { to: true },
    });
    if (!trans) throw new NotFoundException('Invalid session Id');

    if (trans.status !== TransactionStatus.PENDING)
      throw new BadRequestException(
        `you are trying to update a closed transaction`,
      );
    Object.assign(trans, { status });
    console.log(trans);

    return this.save(trans);
  }
}
