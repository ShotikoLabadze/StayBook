import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
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
      throw new NotFoundException('User not found');
    }

    if (updateData.name) user.name = updateData.name;
    if (updateData.avatar) user.avatar = updateData.avatar;

    if (updateData.password) {
      user.password = await bcrypt.hash(updateData.password, this.saltRounds);
    }

    return await user.save();
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find().select('-password').exec();
  }

  async updateRole(userId: string, newRole: string) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { role: newRole }, { new: true })
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async removeUser(userId: string) {
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return { success: true, message: 'User permanently deleted successfully' };
  }

  async toggleFavorite(userId: string, hotelId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isFavorite = user.favorites.some((id) => id.toString() === hotelId);

    if (isFavorite) {
      user.favorites = user.favorites.filter((id) => id.toString() !== hotelId);
    } else {
      user.favorites.push(new Types.ObjectId(hotelId) as any);
    }

    await user.save();
    return { favorites: user.favorites, isFavorite: !isFavorite };
  }

  async getFavorites(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('favorites')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.favorites;
  }
}
