import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class TransferDTO {
  @Expose()
  @IsString()
  @ApiProperty()
  from: string;

  @Expose()
  @IsString()
  @ApiProperty()
  to: string;

  @Expose()
  @IsNumber()
  @ApiProperty()
  amount: number;
}
