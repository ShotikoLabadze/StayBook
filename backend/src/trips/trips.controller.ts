import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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

  @Post(':id/activities')
  async addActivity(
    @Param('id') tripId: string,
    @Body() body: { dayIndex: number; activity: any },
    @Req() req: any,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.tripsService.addActivity(
      tripId,
      body.dayIndex,
      body.activity,
      userId,
    );
  }

  @Delete(':id/activities/:activityId')
  async deleteActivity(
    @Param('id') tripId: string,
    @Param('activityId') activityId: string,
    @Body('dayIndex') dayIndex: number,
    @Req() req: any,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.tripsService.deleteActivity(
      tripId,
      dayIndex,
      activityId,
      userId,
    );
  }

  @Patch(':id/itinerary/reorder')
  async updateItinerary(
    @Param('id') tripId: string,
    @Body('itinerary') itinerary: any[],
    @Req() req: any,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.tripsService.updateItinerary(tripId, itinerary, userId);
  }
}
