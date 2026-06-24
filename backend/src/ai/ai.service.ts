import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateItinerary(
    destination: string,
    durationDays: number,
    budget: string,
  ) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const prompt = `
        You are an expert travel planner. Generate a highly detailed and optimized travel itinerary.
        Destination: ${destination}
        Duration: ${durationDays} days
        Budget level: ${budget}

        CRITICAL: You must return ONLY a raw JSON array that matches the following structure exactly. Do not wrap the response in markdown blocks like \`\`\`json. Do not include any text outside the JSON.

        The structure should be an array of days, matching this TypeScript type:
        Array<{
          dayNumber: number;
          date: string; // Use formatting like "Day 1", "Day 2" or let it be populated dynamically
          activities: Array<{
            id: string; // Unique string identifier like "ai-act-1"
            title: string;
            note: string;
            time: string; // e.g., "10:00 AM"
            cost: number;
            category: 'hotel' | 'flight' | 'food' | 'activity' | 'transport';
            location: {
              name: string;
              lat: number;
              lng: number;
            }
          }>
        }>

        Ensure the coordinates (lat, lng) are real and accurate for ${destination}.
      `;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = result.response.text();
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Gemini AI Error:', error);
      throw new InternalServerErrorException(
        'Failed to generate itinerary using AI.',
      );
    }
  }
}
