import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { BuyTicketDto } from "./dto/buy-ticket.dto";
import { Tickets } from "./ticket.schema";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "src/authentication/authentication.guard";
import { Req } from "@nestjs/common";   
import { RequestWithUser } from "src/users/user.constants";

@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiBearerAuth("authorization")
  @UseGuards(AuthGuard)
  @Post('buy')
  async buyTicket(@Body() buyTicketDto: BuyTicketDto, @Req() req: RequestWithUser): Promise<Tickets> {
    const user = req.user;
    return this.ticketsService.buyTicket(buyTicketDto, user);
  }
}
