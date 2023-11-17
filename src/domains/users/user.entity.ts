import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Transaction } from '../transactions/transaction.entity';
import { Account } from '../accounts/account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  middleName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, length: 64 })
  password: string;

  @Column({ nullable: false })
  idIMG: string;

  @Column({ nullable: false, default: false })
  admin: boolean;

  @Column({ nullable: false, default: false })
  isActive: boolean;

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

  @OneToMany(
    () => Transaction,
    (transaction: Transaction) => transaction.createdBy,
  )
  transactions: Transaction[];

  @OneToMany(() => Account, (account: Account) => account.owner)
  accounts: Account[];

  @OneToMany(() => Account, (account: Account) => account.createdBy)
  createdAccounts: Account[];
}
