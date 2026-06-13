import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Destination,
  DestinationDocument,
} from '../schemas/destination.schema';
import { Hotel, HotelDocument } from '../schemas/hotel.schema';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectModel(Destination.name)
    private destinationModel: Model<DestinationDocument>,

    @InjectModel(Hotel.name)
    private hotelModel: Model<HotelDocument>,
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

  async createHotels(data: any) {
    if (Array.isArray(data)) {
      return this.hotelModel.insertMany(data);
    }
    const newHotel = new this.hotelModel(data);
    return newHotel.save();
  }

  async findHotelsByDestination(destinationSlug: string) {
    return this.hotelModel.find({ destinationId: destinationSlug }).exec();
  }

  async getUniquePropertyTypes() {
    return this.hotelModel.distinct('propertyType').exec();
  }
}
