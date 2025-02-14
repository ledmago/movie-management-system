import { Logger, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import {
  RedisModuleAsyncOptions,
  RedisModule as RedisNativeModule,
} from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisNativeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('redis'),
      inject: [ConfigService],
    } as RedisModuleAsyncOptions),
  ],
  providers: [RedisService, Logger],
  exports: [RedisService]
})
export class RedisModule {}
