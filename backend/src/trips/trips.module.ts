// trips.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelSchema } from '../schemas/hotel.schema';
import {
  Notification,
  NotificationSchema,
} from '../schemas/notification.schema';
import { Trip, TripSchema } from '../schemas/trip.schema';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trip.name, schema: TripSchema },
      { name: 'Hotel', schema: HotelSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
