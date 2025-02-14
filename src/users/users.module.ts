import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [AuthenticationModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), AuthenticationModule, RedisModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, Logger],
  exports: [UsersService]
})
export class UsersModule {}
