import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthenticationService } from "./authentication.service";
import { RedisService } from "src/redis/redis.service";
import { Logger } from "@nestjs/common";
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("privateKey"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthenticationService,
    RedisService,
    JwtService,
    Logger,
  ],
  exports: [JwtModule, AuthenticationService],
})
export class AuthenticationModule {}
