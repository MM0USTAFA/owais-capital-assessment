import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: () => '0',
  })
  balance: number;

  @Column({ unique: true, nullable: false })
  accountNumber: string;

  @Column({ default: false })
  isActive: boolean;

  @ManyToOne(() => User, (user: User) => user.accounts, { nullable: false })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToOne(() => User, (user: User) => user.createdAccounts)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.from)
  outgoingTransactions: Transaction;

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.to)
  incomingTransactions: Transaction;

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
