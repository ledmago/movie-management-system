import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WatchHistory, WatchHistoryDocument } from "./watchhistory.schema";

@Injectable()
export class WatchHistoryRepository {
  constructor(
    @InjectModel(WatchHistory.name)
    private watchHistoryModel: Model<WatchHistoryDocument>
  ) {}

  async create(
    watchHistory: Partial<WatchHistory>
  ): Promise<WatchHistoryDocument> {
    const createdWatchHistory =
      await this.watchHistoryModel.create(watchHistory);
    return createdWatchHistory.toObject();
  }

  async findByUserId(userId: string): Promise<WatchHistoryDocument[]> {
    return this.watchHistoryModel.find({ userId }).lean().exec();
  }
}
