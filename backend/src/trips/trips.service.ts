import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip, TripDocument } from '../schemas/trip.schema';

@Injectable()
export class TripsService {
  constructor(@InjectModel(Trip.name) private tripModel: Model<TripDocument>) {}

  async create(tripData: any, userId: string) {
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);

    const itinerary: any[] = [];
    let currentDayNumber = 1;

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      itinerary.push({
        dayNumber: currentDayNumber,
        date: new Date(date),
        activities: [],
      });
      currentDayNumber++;
    }

    const newTrip = new this.tripModel({
      ...tripData,
      owner: userId,
      itinerary,
    });

    const savedTrip = await newTrip.save();
    return savedTrip;
  }

  async findAllUserTrips(userId: string) {
    const trips = await this.tripModel
      .find({
        $or: [{ owner: userId }, { collaborators: userId }],
      } as any)
      .sort({ createdAt: -1 })
      .exec();

    return trips;
  }

  async findOne(tripId: string, userId: string) {
    const trip = await this.tripModel
      .findOne({
        _id: tripId,
        $or: [{ owner: userId }, { collaborators: userId }],
      } as any)
      .exec();

    if (!trip) {
      throw new NotFoundException('Trip not found or you do not have access!');
    }
    return trip;
  }

  async remove(tripId: string, userId: string) {
    const result = await this.tripModel
      .deleteOne({ _id: tripId, owner: userId } as any)
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Trip not found or you are not the owner!');
    }
    return { success: true, message: 'Trip deleted successfully' };
  }
}
