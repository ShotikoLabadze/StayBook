import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip, TripDocument } from '../schemas/trip.schema';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel('Hotel') private hotelModel: Model<any>,
  ) {}

  async create(tripData: any, userId: string) {
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);

    let hotelActivity: any = null;
    if (tripData.hotelId) {
      const hotel = await this.hotelModel.findById(tripData.hotelId).exec();
      if (hotel) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysCount = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;

        hotelActivity = {
          id: `act-hotel-${Date.now()}`,
          title: `Stay at ${hotel.name}`,
          note: 'Premium luxury sanctuary check-in.',
          time: '15:00',
          cost: hotel.pricePerNight * daysCount,
          category: 'hotel',
          location: {
            name: hotel.neighborhood || hotel.name,
            lat: hotel.coordinates?.lat || 48.8566,
            lng: hotel.coordinates?.lng || 2.3522,
          },
        };
      }
    }

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

        activities:
          currentDayNumber === 1 && hotelActivity ? [hotelActivity] : [],
      });
      currentDayNumber++;
    }

    const newTrip = new this.tripModel({
      ...tripData,
      owner: userId,
      itinerary,

      budget: tripData.budget || {
        totalLimit: hotelActivity ? hotelActivity.cost + 1000 : 2000,
        currency: 'USD',
      },
    });

    const savedTrip = await newTrip.save();
    return savedTrip;
  }

  async findAllUserTrips(userId: string) {
    return this.tripModel
      .find({
        $or: [{ owner: userId }, { collaborators: userId }],
      } as any)
      .sort({ createdAt: -1 })
      .exec();
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
