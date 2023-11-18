import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateAccountDTO {
  @IsBoolean()
  @IsOptional()
  @Expose()
  @ApiProperty({ required: false })
  isActive: boolean;

  @IsNumber()
  @IsOptional()
  @Expose()
  @ApiProperty()
  ownerId: number;
}
