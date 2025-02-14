import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TimeSlot } from './movies.constants';


@Schema()
class Session {
  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, enum: TimeSlot })
  timeSlot: TimeSlot;

  @Prop({ required: true, min: 1 })
  roomNumber: number;
}

const SessionSchema = SchemaFactory.createForClass(Session);

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0 })
  ageRestriction: number;

  @Prop({ type: [SessionSchema], default: [] })
  sessions: Session[];
}

export type MovieDocument = Movie & Document;
export const MovieSchema = SchemaFactory.createForClass(Movie); 