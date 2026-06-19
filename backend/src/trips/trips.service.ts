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
    if (!userId) {
      throw new Error('Unauthorized: User ID not found in token');
    }

    const newTrip = new this.tripModel({
      ...tripData,
      owner: userId,
      itinerary: tripData.itinerary || [],
    });

    return await newTrip.save();
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
    const trip = await this.tripModel.findById(tripId).exec();

    if (!trip) {
      throw new NotFoundException('Trip not found in database!');
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

  async addActivity(
    tripId: string,
    dayIndex: number,
    activity: any,
    userId: string,
  ) {
    const trip = await this.tripModel
      .findOne({
        _id: tripId,
        $or: [{ owner: userId }, { collaborators: userId }],
      } as any)
      .exec();

    if (!trip) throw new NotFoundException('Trip not found or access denied');

    if (!trip.itinerary[dayIndex]) {
      trip.itinerary[dayIndex] = {
        dayNumber: dayIndex + 1,
        date: new Date(),
        activities: [],
      } as any;
    }

    trip.itinerary[dayIndex].activities.push(activity);
    trip.markModified('itinerary');
    return await trip.save();
  }

  async deleteActivity(
    tripId: string,
    dayIndex: number,
    activityId: string,
    userId: string,
  ) {
    const trip = await this.tripModel
      .findOne({
        _id: tripId,
        $or: [{ owner: userId }, { collaborators: userId }],
      } as any)
      .exec();

    if (!trip) throw new NotFoundException('Trip not found or access denied');

    trip.itinerary[dayIndex].activities = trip.itinerary[
      dayIndex
    ].activities.filter((act: any) => act.id !== activityId);

    trip.markModified('itinerary');
    return await trip.save();
  }
  async updateItinerary(
    tripId: string,
    updatedItinerary: any[],
    userId: string,
  ) {
    const trip = await this.tripModel
      .findOne({
        _id: tripId,
        $or: [{ owner: userId }, { collaborators: userId }],
      } as any)
      .exec();
    if (!trip) throw new NotFoundException('Trip not found or access denied');

    trip.itinerary = updatedItinerary;
    trip.markModified('itinerary');
    return await trip.save();
  }
}
