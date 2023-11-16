import { Expose } from 'class-transformer';

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
}
