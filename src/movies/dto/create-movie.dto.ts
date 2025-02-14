import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsArray, ValidateNested, IsDate, IsEnum, IsDateString, MaxLength, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { TimeSlot } from '../movies.constants';

class SessionDto {
  @IsNotEmpty({ message: 'Tarih boş olamaz' })
  @IsDateString()
  date: Date;

  @IsNotEmpty({ message: 'Seans saati boş olamaz' })
  @IsEnum(TimeSlot, { message: 'Geçersiz seans saati' })
  timeSlot: TimeSlot;

  @IsNotEmpty({ message: 'Salon numarası boş olamaz' })
  @IsNumber({}, { message: 'Salon numarası sayı olmalıdır' })
  @Min(1, { message: 'Salon numarası en az 1 olmalıdır' })
  roomNumber: number;
}

export class CreateMovieDto {
  @IsNotEmpty({ message: 'Film adı boş olamaz' })
  @IsString({ message: 'Film adı metin olmalıdır' })
  @MaxLength(100, { message: 'Film adı en fazla 100 karakter olabilir' })
  name: string;

  @IsNotEmpty({ message: 'Yaş sınırı boş olamaz' })
  @IsNumber({}, { message: 'Yaş sınırı sayı olmalıdır' })
  @Min(0, { message: 'Yaş sınırı 0 veya daha büyük olmalıdır' })
  ageRestriction: number;

  @IsArray({ message: 'Seanslar dizi formatında olmalıdır' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'En az bir seans eklenmelidir' })
  @ArrayMaxSize(10, { message: 'En fazla 10 seans eklenebilir' })
  @Type(() => SessionDto)
  sessions: SessionDto[];
}
