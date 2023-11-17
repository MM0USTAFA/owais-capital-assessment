import { Expose, Transform, plainToClass } from 'class-transformer';
import { Account } from 'src/domains/accounts/account.entity';
import { AccountDTO } from 'src/domains/accounts/dtos/account.dto';

export class UserResponseDTO {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  middleName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  idIMG: string;

  @Expose()
  admin: boolean;

  @Expose()
  isActive: boolean;

  @Expose()
  @Transform(
    ({ obj }) => obj.accounts && plainToClass(AccountDTO, obj.accounts),
  )
  accounts: Account[];
}
