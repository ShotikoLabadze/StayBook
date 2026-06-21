import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Testimonial,
  TestimonialDocument,
} from '../schemas/testimonial.schema';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name)
    private testimonialModel: Model<TestimonialDocument>,
  ) {}

  async findAll() {
    return this.testimonialModel.find().exec();
  }

  async create(data: any) {
    if (Array.isArray(data)) {
      return this.testimonialModel.insertMany(data);
    }
    const newTestimonial = new this.testimonialModel(data);
    return newTestimonial.save();
  }

  async remove(id: string) {
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    let result;

    if (isValidObjectId) {
      result = await this.testimonialModel.findByIdAndDelete(id).exec();
    }

    if (!result) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    return { message: `Testimonial with ID ${id} successfully removed` };
  }

  async deleteAll() {
    await this.testimonialModel.deleteMany({}).exec();
    return { message: 'All testimonials have been wiped out from database' };
  }
}
