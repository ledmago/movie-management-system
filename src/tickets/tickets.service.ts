import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { TicketsRepository } from "./tickets.repository";
import { BuyTicketDto } from "./dto/buy-ticket.dto";
import { Tickets } from "./ticket.schema";
import { User, UserDocument } from "src/users/users.schema";
import { MoviesService } from "src/movies/movies.service";
import mongoose from "mongoose";
import * as Exceptions from "./tickets.exceptions";
@Injectable()
export class TicketsService {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    @Inject(forwardRef(() => MoviesService))
    private readonly moviesService: MoviesService
  ) {}

  async buyTicket(
    buyTicketDto: BuyTicketDto,
    user: UserDocument
  ): Promise<Tickets> {
    const { movieId, movieSessionId, seatNumber, price } = buyTicketDto;
    const { movie, movieSession } =
      await this.moviesService.getMovieAndSessionById(movieId, movieSessionId);

    return this.ticketsRepository.create({
      movieId: movie._id,
      movieSessionId: movieSession?._id,
      seatNumber,
      price,
      userId: user._id,
      isUsed: false,
    });
  }

  validateTicket({ticket, userId }: {ticket: Tickets, userId: string}): boolean {

    if (ticket.isUsed) {
      throw Exceptions.TicketAlreadyUsed();
    }

    if (ticket.userId.toString() !== userId) {
      throw Exceptions.TicketIsNotValidForUser();
    }

    return true;
  }

  async useTicket({ ticketId, userId }: { ticketId: string, userId: string }): Promise<Tickets | null> {
    const ticket = await this.ticketsRepository.findById(ticketId);
    if (!ticket) {
      throw Exceptions.TicketNotFound();
    }
    this.validateTicket({ ticket, userId });
   
    const usedTicket = await this.ticketsRepository.useTicket(ticketId);

    return usedTicket;
  }
}
