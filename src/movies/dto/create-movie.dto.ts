import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsArray, ValidateNested, IsDate, IsEnum, IsDateString, MaxLength, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { TimeSlot } from '../movies.constants';

class SessionDto {
  @ApiProperty({ 
    description: 'Session tarihi',
    example: '2024-03-20'
  })
  @IsNotEmpty({ message: 'Tarih boş olamaz' })
  @IsDateString()
  date: Date;

  @ApiProperty({ 
    description: 'Session saati',
    enum: TimeSlot,
    example: TimeSlot.SLOT_10_12
  })
  @IsNotEmpty({ message: 'Session saati boş olamaz' })
  @IsEnum(TimeSlot, { message: 'Geçersiz session saati' })
  timeSlot: TimeSlot;

  @ApiProperty({ 
    description: 'Salon numarası',
    minimum: 1,
    example: 1
  })
  @IsNotEmpty({ message: 'Salon numarası boş olamaz' })
  @IsNumber({}, { message: 'Salon numarası sayı olmalıdır' })
  @Min(1, { message: 'Salon numarası en az 1 olmalıdır' })
  roomNumber: number;
}

export class CreateMovieDto {
  @ApiProperty({ 
    description: 'Movie adı',
    maxLength: 100,
    example: 'Inception'
  })
  @IsNotEmpty({ message: 'Movie adı boş olamaz' })
  @IsString({ message: 'Movie adı metin olmalıdır' })
  @MaxLength(100, { message: 'Movie adı en fazla 100 karakter olabilir' })
  name: string;

  @ApiProperty({ 
    description: 'Yaş sınırı',
    minimum: 0,
    example: 13
  })
  @IsNotEmpty({ message: 'Yaş sınırı boş olamaz' })
  @IsNumber({}, { message: 'Yaş sınırı sayı olmalıdır' })
  @Min(0, { message: 'Yaş sınırı 0 veya daha büyük olmalıdır' })
  ageRestriction: number;

  @ApiProperty({ 
    description: 'Movie sessionları',
    type: [SessionDto],
    minItems: 1,
    maxItems: 10
  })
  @IsArray({ message: 'Sessionlar dizi formatında olmalıdır' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'En az bir session eklenmelidir' })
  @ArrayMaxSize(10, { message: 'En fazla 10 session eklenebilir' })
  @Type(() => SessionDto)
  sessions: SessionDto[];
}

export class CreateBulkMovieDto {
  @ApiProperty({
    description: 'Filmler',
    type: [CreateMovieDto],
  })
  movies: CreateMovieDto[];
}