import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  @Get('dashboard-data')
  getAdminStats() {
    return {
      status: 'success',
      message: 'Welcome to the Admin Dashboard!',
      stats: {
        totalUsers: 42,
        activeBookings: 12,
      },
    };
  }
}
