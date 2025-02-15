import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { WatchHistoryService } from "./watchhistory.service";
import { RequestWithUser } from "src/users/user.constants";
import { WatchHistory } from "./watchhistory.schema";
import { AuthGuard } from "src/authentication/authentication.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
@Controller("watchhistory")
export class WatchhistoryController {
  constructor(private readonly watchHistoryService: WatchHistoryService) {}

  @ApiBearerAuth("authorization")
  @UseGuards(AuthGuard)
  @Get()
  async getWatchHistory(@Req() req: RequestWithUser): Promise<WatchHistory[]> {
    const user = req.user;
    return this.watchHistoryService.getWatchHistory(user);
  }
}
