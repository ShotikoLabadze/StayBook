import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: Partial<User>) {
    const newUser = new this.userModel(userData);
    const savedUser = await newUser.save();
    return savedUser;
  }

  async findOneByEmail(email: string) {
    const foundUser = await this.userModel.findOne({ email }).exec();
    return foundUser;
  }

  async findById(id: string) {
    return await this.userModel.findById(id).exec();
  }
}
