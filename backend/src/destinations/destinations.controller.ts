import { Body, Controller, Get, Post } from '@nestjs/common';
import { DestinationsService } from './destinations.service';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  async getDestinations() {
    return this.destinationsService.findAll();
  }

  @Post()
  async createDestinations(@Body() body: any) {
    return this.destinationsService.create(body);
  }

  @Get()
  async getTestimonials() {
    return this.destinationsService.getTopReviews();
  }
}
