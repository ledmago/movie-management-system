import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthenticationService } from "./authentication.service";
import { RedisService } from "src/redis/redis.service";
import { Logger } from "@nestjs/common";
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>("privateKey");
        if (!secret) {
          throw new Error("JWT secret key not found");
        }
        return {
          secret,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthenticationService,
    RedisService,
    Logger,
  ],
  exports: [JwtModule, AuthenticationService],
})
export class AuthenticationModule {}
