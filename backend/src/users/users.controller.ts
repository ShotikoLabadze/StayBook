import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('users/profile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateData: { name?: string; avatar?: string; password?: string },
  ) {
    return this.usersService.updateProfile(id, updateData);
  }

  @Post('users/favorites/:hotelId')
  async toggleFavorite(
    @Param('hotelId') hotelId: string,
    @Body('userId') userId: string,
  ) {
    return this.usersService.toggleFavorite(userId, hotelId);
  }

  @Post('users/get-favorites')
  async getFavorites(@Body('userId') userId: string) {
    return this.usersService.getFavorites(userId);
  }

  @Get('admin/users')
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Put('admin/users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role);
  }

  @Delete('admin/users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
