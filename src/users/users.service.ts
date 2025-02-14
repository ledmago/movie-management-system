// src/users/users.service.ts
import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { User } from "./users.schema";
import {
  UserLoginRequestDto,
  UserLoginResponseDto,
} from "./dto/login-request.dto";
import { AuthenticationService } from "src/authentication/authentication.service";
import { UsersRepository } from "./users.repository";
import * as Exceptions from "./users.exceptions";
import { UserFormatter } from "./user.formatter";
import { UserRegisterResponseDto } from "./dto/register-request.dto";
import { UserRegisterRequestDto } from "./dto/register-request.dto";
import { UserRole } from "./user.constants";

@Injectable()
export class UsersService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersRepository: UsersRepository
  ) {}

  async login({
    username,
    password,
  }: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    const user = await this.usersRepository.findByUsername({ username });

    if (!user) throw Exceptions.UsernameAndPasswordWrong();
    if (user.isActive == false) throw Exceptions.UserIsDeactive();

    const isPasswordMatch = await bcrypt.compare(password, user.hash);
    if (!isPasswordMatch) throw Exceptions.UsernameAndPasswordWrong();

    const { accessToken, refreshToken } =
      this.authenticationService.generateToken({ user });
    return {
      accessToken,
      refreshToken,
      user: UserFormatter.formatUser(user),
    };
  }

  async register(
    user: UserRegisterRequestDto
  ): Promise<UserRegisterResponseDto> {
    const { username, password, firstName, lastName } = user;

    const existingUser = await this.usersRepository.findByUsername({
      username,
    });
    if (existingUser) throw Exceptions.UsernameAlreadyExists();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersRepository.create({
      username,
      hash: hashedPassword,
      firstName,
      lastName,
      isActive: true,
      role: UserRole.CUSTOMER,
    });

    const { accessToken, refreshToken } =
      this.authenticationService.generateToken({ user });
    return {
      accessToken,
      refreshToken,
      user: UserFormatter.formatUser(newUser),
    };
  }
}
