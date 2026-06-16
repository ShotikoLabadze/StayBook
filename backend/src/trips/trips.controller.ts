import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripsService } from './trips.service';

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  async create(@Body() createTripDto: CreateTripDto, @Req() req: any) {
    const userId = req.user.sub || req.user.id;
    const result = await this.tripsService.create(createTripDto, userId);
    return result;
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return await this.tripsService.findAllUserTrips(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return await this.tripsService.findOne(id, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return await this.tripsService.remove(id, userId);
  }
}
