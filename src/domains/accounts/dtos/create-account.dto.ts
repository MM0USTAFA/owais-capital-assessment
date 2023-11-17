import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateAccountDTO {
  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive: boolean;

  @IsNumber()
  @IsOptional()
  @Expose()
  ownerId: number;
}
