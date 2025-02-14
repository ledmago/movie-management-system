import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { RedisEventsMap } from '@nestjs/microservices/events/redis.events';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private logger: Logger,
  ) {}

  getHealth(): boolean {
    return this.redisClient.status === RedisEventsMap.READY;
  }

  async setWithTtl(key: string, value: string, ttl: number): Promise<void> {
    await this.redisClient.set(key, value, 'EX', ttl);
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }
}
