import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { UserLoginRequestDto, UserLoginResponseDto } from './dto/login-request.dto';
import { UsersService } from './users.service';
import { ApiResponse } from '@nestjs/swagger';


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
  
  @Get('/me')
  getCurrentUser(@Body() userLoginRequestDto: UserLoginRequestDto): Promise<any> {
    return this.userService.login(userLoginRequestDto);
  }
}
