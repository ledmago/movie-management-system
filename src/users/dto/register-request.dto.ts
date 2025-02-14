import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength, Matches, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { FormattedUser } from '../user.formatter';

export class UserRegisterRequestDto {
  @ApiProperty({
    description: "Kullanıcı adı",
    example: "johndoe"
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  username: string;

  @ApiProperty({
    description: "Şifre (en az 8 karakter, bir büyük harf, bir küçük harf ve bir sayı içermeli)",
    example: "Password123"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Şifre en az 8 karakter olmalıdır'
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message: 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
  })
  password: string;

  @ApiProperty({
    description: "Ad",
    example: "John"
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: "Soyad",
    example: "Doe"
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: "Age",
    example: 20
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;
}

export class UserRegisterResponseDto {
  @ApiProperty({
    description: "Access token"
  })
  accessToken: string;

  @ApiProperty({
    description: "Refresh token"
  })
  refreshToken: string;

  @ApiProperty({
    description: "Kullanıcı bilgileri"
  })
  user: FormattedUser;
}