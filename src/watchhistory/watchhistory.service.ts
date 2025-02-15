import { Injectable } from "@nestjs/common";
import { WatchHistoryRepository } from "./watchhistory.repository";
import { WatchHistory } from "./watchhistory.schema";
import { User } from "src/users/users.schema";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class WatchHistoryService {
  constructor(
    private readonly watchHistoryRepository: WatchHistoryRepository,
    private readonly redisService: RedisService
  ) {}

  async createWatchHistory({
    movieId,
    movieSessionId,
    userId,
    ticketId,
  }: {
    movieId: string;
    movieSessionId: string;
    userId: string;
    ticketId: string;
  }): Promise<WatchHistory> {
    return this.watchHistoryRepository.create({
      movieId,
      movieSessionId,
      userId,
      ticketId,
      watchDate: new Date(),
    });
  }

  async getWatchHistory(user: User): Promise<WatchHistory[]> {
    const cacheKey = `watchhistory:${user._id}`;
    
    const cachedHistory = await this.redisService.get(cacheKey);
    if (cachedHistory) {
      return JSON.parse(cachedHistory);
    }

    const history = await this.watchHistoryRepository.findByUserId(user._id?.toString() ?? "");
    await this.redisService.setWithTtl(cacheKey, JSON.stringify(history), 3600); // 1 saat
    return history;
  }

  async deleteWatchHistoryFromCache(userId: string): Promise<void> {
    await this.redisService.delete(`watchhistory:${userId}`);
  }
}
