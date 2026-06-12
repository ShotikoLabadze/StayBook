import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Destination,
  DestinationDocument,
} from '../schemas/destination.schema';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectModel(Destination.name)
    private destinationModel: Model<DestinationDocument>,
  ) {}

  async findAll(): Promise<Destination[]> {
    return this.destinationModel.find().exec();
  }

  async create(data: any): Promise<any> {
    if (Array.isArray(data)) {
      return this.destinationModel.insertMany(data);
    }

    const newDestination = new this.destinationModel(data);
    return newDestination.save();
  }

  async getTopReviews() {
    const destinations = await this.destinationModel
      .find({ 'reviews.0': { $exists: true } })
      .exec();

    const allReviews = destinations.flatMap((dest) =>
      dest.reviews.map((review) => ({
        quote: review.quote,
        author: review.author,
        role: review.role,
        rating: review.rating,
        destinationTitle: dest.title,
      })),
    );

    return allReviews.slice(0, 3);
  }
}
