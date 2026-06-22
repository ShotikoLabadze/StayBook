import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: Partial<User>) {
    const hashedPassword = await bcrypt.hash(
      userData.password!,
      this.saltRounds,
    );

    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });

    return await newUser.save();
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async updateProfile(
    id: string,
    updateData: { name?: string; avatar?: string; password?: string },
  ) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('მომხმარებელი ვერ მოიძებნა');
    }

    if (updateData.name) user.name = updateData.name;
    if (updateData.avatar) user.avatar = updateData.avatar;

    if (updateData.password) {
      user.password = await bcrypt.hash(updateData.password, this.saltRounds);
    }

    return await user.save();
  }
}
