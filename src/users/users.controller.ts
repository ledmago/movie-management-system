import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { UserLoginRequestDto, UserLoginResponseDto } from './dto/login-request.dto';
import { UsersService } from './users.service';
import { ApiResponse } from '@nestjs/swagger';
import { UserRegisterResponseDto } from './dto/register-request.dto';
import { UserRegisterRequestDto } from './dto/register-request.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/auth/login')
  @ApiResponse({
    status: HttpStatus.OK, 
    description: 'Login user successfully',
    type: UserLoginResponseDto, // Specify the response type
  })
  login(@Body() userLoginRequestDto: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    return this.userService.login(userLoginRequestDto);
  }

  @Post('/auth/register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Register user successfully',
    type: UserLoginResponseDto,
  })
  register(@Body() user: UserRegisterRequestDto): Promise<UserRegisterResponseDto> {
    return this.userService.register(user);
  }
}
