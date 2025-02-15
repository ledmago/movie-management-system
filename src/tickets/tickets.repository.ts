// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tickets, TicketsDocument } from './ticket.schema';

@Injectable()
export class TicketsRepository{

  constructor(@InjectModel(Tickets.name) private ticketModel: Model<TicketsDocument>){}


  async create(user: Partial<Tickets>): Promise<TicketsDocument> {
    const createdUser = await this.ticketModel.create(user);
    return createdUser.toObject();
  }

  async findById(id: string): Promise<TicketsDocument | null> {
    return this.ticketModel.findById(id).lean().exec();
  }

  async useTicket(ticketId: string): Promise<TicketsDocument | null> {
    return this.ticketModel.findByIdAndUpdate(ticketId, { isUsed: true }, { new: true });
  }
}