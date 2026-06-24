import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Destination, DestinationSchema } from '../schemas/destination.schema';
import { Hotel, HotelSchema } from '../schemas/hotel.schema';
import { Review, ReviewSchema } from '../schemas/review.schema';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Hotel.name, schema: HotelSchema },
      { name: Destination.name, schema: DestinationSchema },
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
