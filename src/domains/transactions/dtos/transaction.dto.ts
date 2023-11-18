import {
  Expose,
  Transform,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import { TransactionType } from '../models/transaction-type.model';
import { TransactionStatus } from '../models/transaction-status.model';
import { User } from 'src/domains/users/user.entity';
import { Account } from 'src/domains/accounts/account.entity';
import { UserResponseDTO } from 'src/domains/users/dtos/user-response.dto';

export class TransactionDTO {
  @Expose()
  id: number;

  @Expose()
  transactionType: TransactionType;

  @Expose()
  status: TransactionStatus;

  @Expose()
  depositSession: string;

  @Expose()
  amount: number;

  @Expose()
  @Transform(
    ({ obj: { createdBy } }) =>
      createdBy && {
        id: createdBy.id,
        isAdmin: createdBy.admin,
        name: `${createdBy.firstName} ${createdBy.lastName}`,
      },
  )
  createdBy: User;

  @Expose()
  @Transform(
    ({ obj: { from } }) =>
      from && {
        id: from.id,
        accountNumber: from.accountNumber,
        owner: plainToClass(UserResponseDTO, from.owner, {
          excludeExtraneousValues: true,
        }),
      },
  )
  from: Account;

  @Expose()
  @Transform(
    ({ obj: { to } }) =>
      to && {
        id: to.id,
        accountNumber: to.accountNumber,
        owner: plainToClass(UserResponseDTO, to.owner, {
          excludeExtraneousValues: true,
        }),
      },
  )
  to: Account;
}
