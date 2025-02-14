import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/users/users.schema';
import * as speakeasy from 'speakeasy';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthenticationService {
    constructor(private readonly jwtService: JwtService, private readonly redisService: RedisService) { }

    verifyGaCode({ user, code }: { user: UserDocument, code: string }): Boolean {
        return speakeasy.totp.verify({
            secret: user.secret,
            encoding: "base32",
            token: code,
        }) as Boolean;
    }

    generateToken({ user }): { accessToken: string; refreshToken: string } {
        const accessToken = this.jwtService.sign({ _id: user._id, username: user.username }, { expiresIn: '30m', });
        const refreshToken = this.jwtService.sign({ _id: user._id, username: user.username }, { expiresIn: '3d', });
        return {
            accessToken,
            refreshToken
        }
    }

    async storeTokenInRedis(tokenKey: string, userId: string, ttl: number): Promise<void> {
        await this.redisService.setWithTtl(tokenKey, userId, ttl);
    }
}
