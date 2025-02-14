// src/users/users.service.ts
import { BadGatewayException, BadRequestException, HttpException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './users.schema';
import { UserLoginRequestDto, UserLoginResponseDto } from './dto/login-request.dto';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { UsersRepository } from './users.repository';
import * as Exceptions from 'src/common/exceptions';
import { UserFormatter } from './user.formatter';

@Injectable()
export class UsersService {

  constructor(private readonly authenticationService: AuthenticationService, private readonly usersRepository: UsersRepository) { }

  async login({ username, password, gaCode }: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    const user = await this.usersRepository.findByUsername({ username });

    if (!user) throw Exceptions.UsernameAndPasswordWrong();
    if (user.isActive == false) throw Exceptions.UserIsDeactive();

    if (user.secret && !this.authenticationService.verifyGaCode({ user, code: gaCode || '' })) throw Exceptions.InvalidGaCode();

    const isPasswordMatch = await bcrypt.compare(password, user.hash);
    if (!isPasswordMatch) throw Exceptions.UsernameAndPasswordWrong();

    const { accessToken, refreshToken } = this.authenticationService.generateToken({user})
    return {
      accessToken,
      refreshToken,
      user: UserFormatter.formatUser(user)
    };
  }
}