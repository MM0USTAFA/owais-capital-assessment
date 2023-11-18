import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IQueryBase } from 'src/shared/interfaces/query-base';

export class QueryDTO implements IQueryBase {
  @ApiProperty({
    required: false,
    description: 'select all excluding provided ids',
  })
  @IsString()
  @IsOptional()
  @Expose()
  exclude?: string;

  @ApiProperty({
    required: false,
    description: 'pagination page number',
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  page?: number;

  @ApiProperty({
    required: false,
    description:
      'the value to be searched for, it worked on part not identical match',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description:
      'the fields to be searched on it (note: when use subfields were populated first)',
  })
  @IsString()
  @IsOptional()
  @Expose()
  searchFields?: string;

  @ApiProperty({
    required: false,
    description:
      'the fields to be searched on it (note: when use subfields were populated first)',
  })
  @IsString()
  @IsOptional()
  @Expose()
  select?: string;

  @ApiProperty({
    required: false,
    description: 'the fields to be joined be carfuel while using it',
  })
  @IsString()
  @IsOptional()
  @Expose()
  popFields?: string;

  @ApiProperty({
    required: false,
    description:
      'sort records depends on record name with or without negative sign when using negative signs the order will be descending',
  })
  @IsString()
  @IsOptional()
  @Expose()
  sort?: string;
}
