// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './users.schema';
import { UserLoginRequestDto } from './dto/login-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository{

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

  async findByUsername({ username }: {username: string}): Promise<UserDocument | null> {
    return this.userModel.findOne({username}).lean().exec();
  }

  async create(user: Partial<User>): Promise<UserDocument> {
    const createdUser = await this.userModel.create(user);
    return createdUser.toObject();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).lean().exec();
  }
}