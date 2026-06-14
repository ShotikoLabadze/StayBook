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

  async findHotelsByDestination(destinationSlug: string, queryParams: any) {
    const { search, sortBy, minPrice, maxPrice, rating, propertyTypes } =
      queryParams;

    let filter: any = {};

    if (destinationSlug !== 'all') {
      filter.destinationId = destinationSlug;
    }

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    if (propertyTypes) {
      const typesArray = Array.isArray(propertyTypes)
        ? propertyTypes
        : propertyTypes.split(',');
      if (typesArray.length > 0) {
        filter.propertyType = { $in: typesArray };
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { neighborhood: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOptions: any = {};
    if (sortBy === 'priceLow') {
      sortOptions.pricePerNight = 1;
    } else if (sortBy === 'priceHigh') {
      sortOptions.pricePerNight = -1;
    } else if (sortBy === 'rating') {
      sortOptions.rating = -1;
    } else {
      sortOptions.reviewCount = -1;
    }

    return this.hotelModel.find(filter).sort(sortOptions).exec();
  }

  async getUniquePropertyTypes() {
    return this.hotelModel.distinct('propertyType').exec();
  }

  async getUniqueCategories() {
    return this.destinationModel.distinct('category').exec();
  }

  async getUniqueWeatherConditions() {
    return this.destinationModel.distinct('weather.condition').exec();
  }

  async getUniqueDurations() {
    return this.destinationModel.distinct('duration').exec();
  }

  async getUniqueActivities() {
    return this.destinationModel.distinct('activities').exec();
  }
}
