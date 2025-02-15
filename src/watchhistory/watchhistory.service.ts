import { Injectable } from "@nestjs/common";
import { WatchHistoryRepository } from "./watchhistory.repository";
import { WatchHistory } from "./watchhistory.schema";
import { User } from "src/users/users.schema";
@Injectable()
export class WatchHistoryService {
  constructor(
    private readonly watchHistoryRepository: WatchHistoryRepository
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
    console.log(user)
    return this.watchHistoryRepository.findByUserId(user._id?.toString() ?? "");
  }
}
