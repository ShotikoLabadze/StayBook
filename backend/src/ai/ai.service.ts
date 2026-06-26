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
        model: 'gemini-2.5-flash',
      });

      const prompt = `
        You are a premium luxury travel planner. Generate a highly detailed travel itinerary.
        Destination: ${destination}
        Duration: ${durationDays} days
        Budget level: ${budget}

        CRITICAL REQUIREMENT: You must return ONLY a raw JSON array. Do not include markdown blocks like \`\`\`json. Do not include any conversational text.

        The response must be a JSON array of days matching this structure exactly:
        [
          {
            "dayNumber": 1,
            "title": "Arrival & Initial Exploration",
            "date": "Day 1 Schedule",
            "activities": [
              {
                "id": "ai-act-unique-1",
                "title": "Luxury Private Jet Arrival or Check-in",
                "note": "Smooth transition to the luxury suite with welcoming drinks.",
                "time": "10:00 AM",
                "cost": 450,
                "category": "hotel", 
                "location": {
                  "name": "Exact Premium Hotel Name in ${destination}",
                  "lat": 36.4166,
                  "lng": 25.4324
                }
              }
            ]
          }
        ]

        Guidelines for categories and values:
        - Allowed categories: 'hotel' | 'flight' | 'food' | 'activity' | 'transport'.
        - Make sure "cost" is a realistic number based on the "${budget}" budget level.
        - Ensure that coordinates (lat, lng) are real, highly accurate, and located strictly within ${destination} so they render correctly on a map.
        - Generate exactly ${durationDays} items in the main days array.
      `;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
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
