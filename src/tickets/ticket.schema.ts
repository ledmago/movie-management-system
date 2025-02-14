import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Tickets {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Movie', required: true })
  movieId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'MovieSession', required: true })
  movieSessionId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  seatNumber: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ default: false })
  isUsed: boolean;
}

export type TicketsDocument = Tickets & Document;
export const TicketsSchema = SchemaFactory.createForClass(Tickets); 