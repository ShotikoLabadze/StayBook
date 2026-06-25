import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  async updateProfile(
    @Body()
    updateData: {
      userId: string;
      name?: string;
      avatar?: string;
      password?: string;
    },
  ) {
    const { userId, ...data } = updateData;
    return this.usersService.updateProfile(userId, data);
  }

  @Post('favorites/:hotelId')
  async toggleFavorite(
    @Param('hotelId') hotelId: string,
    @Body('userId') userId: string,
  ) {
    return this.usersService.toggleFavorite(userId, hotelId);
  }

  @Post('get-favorites')
  async getFavorites(@Body('userId') userId: string) {
    return this.usersService.getFavorites(userId);
  }

  @Get('admin/all')
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Put('admin/:id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role);
  }

  @Delete('admin/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
