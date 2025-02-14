import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "src/redis/redis.service";
import { JwtPayload } from "./authentication.constants";
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  generateToken({ user }): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.sign(
      { id: user._id, username: user.username },
      { expiresIn: "30m" }
    );
    const refreshToken = this.jwtService.sign(
      { id: user._id, username: user.username },
      { expiresIn: "3d" }
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async storeTokenInRedis(
    tokenKey: string,
    userId: string,
    ttl: number
  ): Promise<void> {
    await this.redisService.setWithTtl(tokenKey, userId, ttl);
  }

  async verifyAsync(token: string): Promise<JwtPayload> {
    const payload = await this.jwtService.verifyAsync(token);
    return payload;
  }
}
