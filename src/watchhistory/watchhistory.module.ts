import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchHistoryService } from './watchhistory.service';
import { WatchHistory, WatchHistorySchema } from './watchhistory.schema';
import { WatchHistoryRepository } from './watchhistory.repository';
import { WatchhistoryController } from './watchhistory.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { RedisModule } from 'src/redis/redis.module';
@Module({
    imports: [
        AuthenticationModule,
        UsersModule,
        MongooseModule.forFeature([{ name: WatchHistory.name, schema: WatchHistorySchema }]),
        RedisModule
    ],
    providers: [WatchHistoryService, WatchHistoryRepository,],
    exports: [WatchHistoryService, WatchHistoryRepository],
    controllers: [WatchhistoryController],
})
export class WatchhistoryModule {}
