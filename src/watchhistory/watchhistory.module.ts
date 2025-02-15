import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchHistoryService } from './watchhistory.service';
import { WatchHistory, WatchHistorySchema } from './watchhistory.schema';
import { WatchHistoryRepository } from './watchhistory.repository';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: WatchHistory.name, schema: WatchHistorySchema }]),
    ],
    providers: [WatchHistoryService, WatchHistoryRepository],
    exports: [WatchHistoryService, WatchHistoryRepository],
})
export class WatchhistoryModule {}
