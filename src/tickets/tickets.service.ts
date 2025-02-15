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

    const isSeatTaken =
      await this.ticketsRepository.findByMovieSessionIdAndSeatNumber(
        movieSessionId,
        seatNumber.toString()
      );

    if (isSeatTaken) {
      throw Exceptions.SeatAlreadyTaken();
    }

    return this.ticketsRepository.create({
      movieId: movie._id,
      movieSessionId: movieSession?._id,
      seatNumber,
      price,
      userId: user._id,
      isUsed: false,
    });
  }

  validateTicket({
    ticket,
    userId,
    movieId,
    movieSessionId,
  }: {
    ticket: Tickets;
    userId: string;
    movieId: string;
    movieSessionId: string;
  }): boolean {
    if (ticket.isUsed) {
      throw Exceptions.TicketAlreadyUsed();
    }

    if (ticket.userId.toString() !== userId) {
      throw Exceptions.TicketIsNotValidForUser();
    }

    if (ticket.movieId.toString() !== movieId) {
      throw Exceptions.TicketIsNotValidForMovie();
    }

    if (ticket.movieSessionId.toString() !== movieSessionId) {
      throw Exceptions.TicketIsNotValidForMovieSession();
    }

    return true;
  }

  async useTicket({
    movieId,
    movieSessionId,
    ticketId,
    userId,
  }: {
    movieId: string;
    movieSessionId: string;
    ticketId: string;
    userId: string;
  }): Promise<Tickets | null> {
    const ticket = await this.ticketsRepository.findById(ticketId);
    if (!ticket) {
      throw Exceptions.TicketNotFound();
    }
    this.validateTicket({ ticket, userId, movieId, movieSessionId });

    const usedTicket = await this.ticketsRepository.useTicket(ticketId);

    return usedTicket;
  }
}
