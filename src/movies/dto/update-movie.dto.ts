import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
  IsDate,
  IsEnum,
  IsDateString,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { TimeSlot } from "../movies.constants";

class UpdateSessionDto {
  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsEnum(TimeSlot, { message: "Geçersiz seans saati" })
  timeSlot?: TimeSlot;

  @IsOptional()
  @IsNumber({}, { message: "Salon numarası sayı olmalıdır" })
  @Min(1, { message: "Salon numarası en az 1 olmalıdır" })
  roomNumber?: number;
}

export class UpdateMovieDto {
  @IsOptional()
  @IsString({ message: "Film adı metin olmalıdır" })
  @MaxLength(100, { message: "Film adı en fazla 100 karakter olabilir" })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: "Yaş sınırı sayı olmalıdır" })
  @Min(0, { message: "Yaş sınırı 0 veya daha büyük olmalıdır" })
  ageRestriction?: number;

  @IsOptional()
  @IsArray({ message: "Seanslar dizi formatında olmalıdır" })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: "En az bir seans eklenmelidir" })
  @ArrayMaxSize(10, { message: "En fazla 10 seans eklenebilir" })
  @Type(() => UpdateSessionDto)
  sessions?: UpdateSessionDto[];
}
