import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  async getTestimonials() {
    return this.testimonialsService.findAll();
  }

  @Post()
  async createTestimonial(@Body() body: any) {
    return this.testimonialsService.create(body);
  }

  @Delete('all')
  async deleteAllTestimonials() {
    return this.testimonialsService.deleteAll();
  }

  @Delete(':id')
  async deleteTestimonial(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}
