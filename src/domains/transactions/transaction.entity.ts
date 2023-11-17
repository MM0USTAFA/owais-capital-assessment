import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { TransactionType } from './models/transaction-type.model';
import { TransactionStatus } from './models/transaction-status.model';
import { Account } from '../accounts/account.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TransactionType })
  transactionType: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Column({ nullable: true })
  depositSession: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: false })
  amount: number;

  @ManyToOne(() => User, (user: User) => user.transactions, { nullable: false })
  createdBy: User;

  @ManyToOne(
    () => Account,
    (account: Account) => account.outgoingTransactions,
    { nullable: true },
  )
  @JoinColumn({ name: 'fromId' })
  from: Account;

  @ManyToOne(
    () => Account,
    (account: Account) => account.incomingTransactions,
    { nullable: true },
  )
  @JoinColumn({ name: 'toId' })
  to: Account;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
