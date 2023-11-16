import { Exclude, Transform } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IsMatch } from 'src/shared/decorators/match.decorator';

export class SignUpDTO {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  middleName: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsDefined()
  @IsNotEmpty()
  @IsMatch('password')
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  idIMG: string;

  @Exclude()
  admin: boolean;

  @Exclude()
  isActive: false;
}
