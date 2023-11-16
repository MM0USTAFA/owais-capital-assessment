import { Expose } from 'class-transformer';

export class TokenDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  admin: boolean;

  @Expose()
  isActive: boolean;
}
