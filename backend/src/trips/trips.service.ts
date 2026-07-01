import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';
import {
  Notification,
  NotificationDocument,
} from '../schemas/notification.schema';
import { Trip, TripDocument } from '../schemas/trip.schema';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel('Hotel') private hotelModel: Model<any>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(tripData: any, userId: string) {
    if (!userId) {
      throw new Error('Unauthorized: User ID not found in token');
    }

    let itinerary = tripData.itinerary || [];

    if (itinerary.length === 0 && tripData.startDate && tripData.endDate) {
      const start = new Date(tripData.startDate);
      const end = new Date(tripData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      const lat = tripData.latitude ? Number(tripData.latitude) : 41.8902;
      const lng = tripData.longitude ? Number(tripData.longitude) : 12.4964;

      for (let i = 0; i < totalDays; i++) {
        const currentDayDate = new Date(start);
        currentDayDate.setDate(start.getDate() + i);

        const activities =
          i === 0
            ? [
                {
                  id: `act-hotel-${Date.now()}`,
                  title: tripData.title || 'Luxury Sanctuary Accommodations',
                  category: 'hotel',
                  cost: Number(tripData.totalPrice) || 0,
                  time: '15:00',
                  note: 'Premium Suite Reserved via StayBook Bespoke Concierge.',
                  location: {
                    name: tripData.destination || 'Selected Sanctuary Location',
                    lat: lat,
                    lng: lng,
                  },
                },
              ]
            : [];

        itinerary.push({
          dayNumber: i + 1,
          date: currentDayDate.toISOString().split('T')[0],
          activities,
        });
      }
    }

    const newTrip = new this.tripModel({
      ...tripData,
      owner: userId,
      itinerary,
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

  async shareTrip(tripId: string, friendEmail: string, ownerId: string) {
    const trip = await this.tripModel
      .findOne({ _id: tripId, owner: ownerId } as any)
      .exec();

    if (!trip) {
      throw new NotFoundException('Trip not found or you are not the owner');
    }

    const friend = await this.hotelModel.db
      .model('User')
      .findOne({ email: friendEmail })
      .exec();

    if (!friend) {
      throw new BadRequestException('User with this email does not exist.');
    }

    if (trip.collaborators.includes(friend._id)) {
      throw new BadRequestException('This user is already a collaborator.');
    }

    const existingInvite = await this.notificationModel
      .findOne({
        recipient: friend._id,
        type: 'invite',
        'metadata.tripId': tripId,
        isRead: false,
      } as any)
      .exec();

    if (existingInvite) {
      throw new BadRequestException(
        'An active invitation has already been sent to this user.',
      );
    }

    try {
      await this.notificationsService.createAndSend(
        friend._id.toString(),
        'Trip Invitation ✈️',
        `You have been invited to join the trip: "${trip.title}"`,
        'invite',
        {
          tripId: trip._id,
          senderId: ownerId,
        },
      );
      return {
        success: true,
        message: 'Invitation sent to user notifications!',
      };
    } catch (error) {
      throw error;
    }
  }

  async acceptInvitation(tripId: string, userId: string) {
    const trip = await this.tripModel.findById(tripId).exec();
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.collaborators.includes(userId as any)) {
      throw new BadRequestException('You are already a collaborator.');
    }

    trip.collaborators.push(userId as any);
    await trip.save();

    await this.notificationModel
      .updateMany(
        {
          recipient: new Types.ObjectId(userId),
          type: 'invite',
          'metadata.tripId': tripId,
        } as any,
        { isRead: true },
      )
      .exec();

    return { success: true, message: 'You successfully joined the trip!' };
  }
}
