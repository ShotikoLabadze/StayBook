import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':targetType/:targetId')
  @UseGuards(JwtAuthGuard)
  async addReview(
    @Param('targetType') targetType: 'hotel' | 'destination',
    @Param('targetId') targetId: string,
    @Body() body: { rating: number; comment: string },
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.reviewsService.createReview(userId, targetId, targetType, body);
  }

  @Get(':targetId')
  async getReviews(@Param('targetId') targetId: string) {
    return this.reviewsService.findByTarget(targetId);
  }
}
