import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Destination,
  DestinationDocument,
} from '../schemas/destination.schema';
import { Hotel, HotelDocument } from '../schemas/hotel.schema';
import { Review, ReviewDocument } from '../schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    @InjectModel(Destination.name)
    private destinationModel: Model<DestinationDocument>,
  ) {}

  async createReview(
    userId: string,
    targetId: string,
    targetType: 'hotel' | 'destination',
    reviewData: any,
  ) {
    const newReview = new this.reviewModel({
      user: userId,
      targetId,
      targetType,
      ...reviewData,
    });
    await newReview.save();

    await this.updateTargetRating(targetId, targetType);

    return newReview.populate('user', 'name avatar');
  }

  async findByTarget(targetId: string) {
    return this.reviewModel
      .find({ targetId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  private async updateTargetRating(
    targetId: string,
    targetType: 'hotel' | 'destination',
  ) {
    const stats = await this.reviewModel.aggregate([
      { $match: { targetId } },
      {
        $group: {
          _id: '$targetId',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const rating = stats[0]?.avgRating
      ? Math.round(stats[0].avgRating * 10) / 10
      : 4.5;
    const reviewCount = stats[0]?.totalReviews || 0;

    if (targetType === 'hotel') {
      await this.hotelModel.findOneAndUpdate(
        { id: targetId },
        { rating, reviewCount },
      );
    } else {
      await this.destinationModel.findOneAndUpdate(
        { id: targetId },
        { rating, reviewCount },
      );
    }
  }
}
