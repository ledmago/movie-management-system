import { Logger, Module, forwardRef } from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { TicketsController } from "./tickets.controller";
import { TicketsRepository } from "./tickets.repository";
import { MoviesService } from "src/movies/movies.service";
import { MongooseModule } from "@nestjs/mongoose";
import { TicketsSchema } from "./ticket.schema";
import { Tickets } from "./ticket.schema";
import { MoviesModule } from "src/movies/movies.module";
import { JwtService } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { WatchhistoryModule } from "src/watchhistory/watchhistory.module";
@Module({
  imports: [
    UsersModule,
    forwardRef(() => MoviesModule),
    WatchhistoryModule,
    MongooseModule.forFeature([{ name: Tickets.name, schema: TicketsSchema }]),
  ],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    TicketsRepository,
    JwtService,
    MoviesService,
    Logger,
  ],
  exports: [TicketsService],
})
export class TicketsModule {}
