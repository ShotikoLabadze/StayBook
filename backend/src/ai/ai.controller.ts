import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  async generateTrip(
    @Body() body: { destination: string; durationDays: number; budget: string },
  ) {
    const itinerary = await this.aiService.generateItinerary(
      body.destination,
      body.durationDays,
      body.budget,
    );

    return {
      status: 'success',
      itinerary,
    };
  }

  @Post('chat')
  async handleChat(@Body('message') message: string) {
    return this.aiService.chatReply(message);
  }
}
