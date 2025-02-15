import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class WatchHistory {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Movie', required: true })
  movieId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'MovieSession', required: true })
  movieSessionId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId:string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tickets', required: true })
  ticketId: string;

  @Prop({ required: true })
  watchDate: Date;
}

export type WatchHistoryDocument = WatchHistory & Document;
export const WatchHistorySchema = SchemaFactory.createForClass(WatchHistory);
