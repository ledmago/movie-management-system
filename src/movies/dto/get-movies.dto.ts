import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMoviesDto {
  @ApiProperty({
    description: 'Sayfa numarası',
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Sayfa numarası sayı olmalıdır' })
  @Min(1, { message: 'Sayfa numarası en az 1 olmalıdır' })
  page?: number = 1;

  @ApiProperty({
    description: 'Sayfa başına gösterilecek Movie sayısı',
    required: false,
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit sayı olmalıdır' })
  @Min(1, { message: 'Limit en az 1 olmalıdır' })
  limit?: number = 10;

  @ApiProperty({
    description: 'Film adı',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Yaş sınırı',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ageRestriction?: number;
}
