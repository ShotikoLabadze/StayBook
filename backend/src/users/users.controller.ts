import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
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
