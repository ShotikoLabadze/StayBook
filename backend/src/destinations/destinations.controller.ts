import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DestinationsService } from './destinations.service';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get(':slug/hotels')
  async getDestinationHotels(@Param('slug') slug: string) {
    return this.destinationsService.findHotelsByDestination(slug);
  }

  @Post('hotels')
  async createHotels(@Body() body: any) {
    return this.destinationsService.createHotels(body);
  }

  @Get()
  async getDestinations() {
    return this.destinationsService.findAll();
  }

  @Post()
  async createDestinations(@Body() body: any) {
    return this.destinationsService.create(body);
  }

  @Get('property-types')
  async getPropertyTypes() {
    return this.destinationsService.getUniquePropertyTypes();
  }
}
