import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchhistoryService } from './watchhistory.service';
import { WatchHistory, WatchHistorySchema } from './watchhistory.schema';
import { WatchHistoryRepository } from './watchhistory.repository';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: WatchHistory.name, schema: WatchHistorySchema }]),
    ],
    providers: [WatchhistoryService, WatchHistoryRepository],
    exports: [WatchhistoryService],
})
export class WatchhistoryModule {}
