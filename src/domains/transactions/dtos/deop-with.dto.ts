import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class DropWithDTO {
  @Expose()
  @IsString()
  @ApiProperty()
  accountNumber: string;

  @Expose()
  @IsNumber()
  @ApiProperty()
  amount: number;
}
