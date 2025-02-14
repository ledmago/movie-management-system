import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { FormattedUser } from '../user.formatter';


export class UserLoginRequestDto {
  @ApiProperty({
    description: "User login request"
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim()) // Boşlukları kaldır
  username: string;

  @ApiProperty({
    description: "password"
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "ga code"
  })
  @IsString()
  gaCode?: string;
}

export class UserLoginResponseDto {
  @ApiProperty({
    description: "accessToken"
  })
  accessToken: string;

  @ApiProperty({
    description: "refreshToken"
  })
  refreshToken: string;

  @ApiProperty({
    description: "user"
  })
  user: FormattedUser;
}