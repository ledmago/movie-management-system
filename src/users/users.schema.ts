import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { UserRole } from './user.constants';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, })
  hash: string;

  @Prop({type: Boolean, default: true, required: false, })
  isActive: boolean;

  @Prop({ type: String, enum: UserRole, required: true })
  role: UserRole;

  @Prop({ required: true, })
  firstName: string;

  @Prop({ required: true, })
  lastName: string;

  @Prop({ required: true, })
  age: number;

  _id?: ObjectId;
}


// Schema Factory oluşturma
export const UserSchema = SchemaFactory.createForClass(User);

// Virtuals ayarlama
UserSchema.set('toJSON', { virtuals: true });
