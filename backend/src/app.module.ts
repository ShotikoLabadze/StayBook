import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { DestinationsModule } from './destinations/destinations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { TripsModule } from './trips/trips.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    AiModule,
    NotificationsModule,
    ReviewsModule,
    UsersModule,
    AuthModule,
    TripsModule,
    DestinationsModule,
    AdminModule,
    TestimonialsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
