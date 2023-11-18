import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IQueryBase } from 'src/shared/interfaces/query-base';

export class QueryDTO implements IQueryBase {
  @ApiProperty({
    description: 'select all excluding provided ids',
    example: '1,3,4',
  })
  @IsString()
  @Expose()
  exclude?: string;

  @ApiProperty({
    description: 'pagination page number',
    example: '1,3,4',
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  page?: number;

  @ApiProperty({
    description:
      'the value to be searched for, it worked on part not identical match',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description:
      'the fields to be searched on it (note: when use subfields were populated first)',
    example: 'field1,field2,field3.subfield',
  })
  @IsString()
  @IsOptional()
  @Expose()
  searchFields?: string;

  @ApiProperty({
    description:
      'the fields to be searched on it (note: when use subfields were populated first)',
    example: 'field1,field2,field3.subfield',
  })
  @IsString()
  @IsOptional()
  @Expose()
  select?: string;

  @ApiProperty({
    description: 'the fields to be joined be carfuel while using it',
    example: 'field1,field2,field3.subfield',
  })
  @IsString()
  @IsOptional()
  @Expose()
  popFields?: string;

  @ApiProperty({
    description:
      'sort records depends on record name with or without negative sign when using negative signs the order will be descending',
    example: '-field1,field2,-field3',
  })
  @IsString()
  @IsOptional()
  @Expose()
  sort?: string;
}
