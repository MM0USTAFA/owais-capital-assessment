import { Expose, Transform } from 'class-transformer';
import { User } from 'src/domains/users/user.entity';

export class AccountDTO {
  @Expose()
  id: number;

  @Expose()
  accountNumber: string;

  @Expose()
  isActive: boolean;

  @Expose()
  balance: number;

  @Transform(
    ({ obj }) =>
      obj.owner && {
        id: obj.owner.id,
        fullName: `${obj.owner.firstName} ${obj.owner.middleName} ${obj.owner.lastName}`,
        email: obj.owner.email,
      },
  )
  @Expose()
  owner?: Partial<User>;

  @Transform(
    ({ obj }) =>
      obj.createdBy && {
        id: obj.createdBy?.id,
        isAdmin: obj.createdBy?.admin,
      },
  )
  @Expose()
  createdBy?: Partial<User>;
}
