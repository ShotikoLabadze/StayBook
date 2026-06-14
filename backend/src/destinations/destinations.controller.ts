import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DestinationsService } from './destinations.service';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get('property-types')
  async getPropertyTypes() {
    return this.destinationsService.getUniquePropertyTypes();
  }

  @Get()
  async getDestinations() {
    return this.destinationsService.findAll();
  }

  @Get('categories')
  async getCategories() {
    return this.destinationsService.getUniqueCategories();
  }

  @Get('weather-conditions')
  async getWeatherConditions() {
    return this.destinationsService.getUniqueWeatherConditions();
  }

  @Get('durations')
  async getDurations() {
    return this.destinationsService.getUniqueDurations();
  }

  @Get('hotels/:id')
  async getHotelById(@Param('id') id: string) {
    return this.destinationsService.findHotelById(id);
  }

  @Get('activities')
  async getActivities() {
    return this.destinationsService.getUniqueActivities();
  }

  @Get(':slug/hotels')
  async getDestinationHotels(
    @Param('slug') slug: string,
    @Query() queryParams: any,
  ) {
    return this.destinationsService.findHotelsByDestination(slug, queryParams);
  }

  @Post('hotels')
  async createHotels(@Body() body: any) {
    return this.destinationsService.createHotels(body);
  }

  @Post()
  async createDestinations(@Body() body: any) {
    return this.destinationsService.create(body);
  }
}
