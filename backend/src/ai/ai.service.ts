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
                "lat": 41.8902,
                "lng": 12.4922
              }
            }
          ]
        }
      ]

      Guidelines for layout, lengths, and constraints:
      - CRITICAL: Generate EXACTLY ${durationDays} items in the main days array.
      - For each day, provide EXACTLY 3 high-quality, distinct activities. Do NOT generate more or less than 3 activities per day.
      - Keep the activity "title" short and premium (maximum 5-6 words).
      - CRITICAL TEXT LENGTH CONSTRAINT: Keep the activity "note" concise. MAXIMUM 12-15 words per note. No long paragraphs.

      Guidelines for categories and values:
      - Allowed categories: 'hotel' | 'flight' | 'food' | 'activity' | 'transport'.
      - Make sure "cost" is a realistic number based on the "${budget}" budget level.
      - Ensure that coordinates (lat, lng) are real, highly accurate, and located strictly within ${destination}.
    `;

    try {
      console.log('Attempting itinerary generation with Gemini 2.5 Flash...');
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });
      return await this.executeGeneration(model, prompt);
    } catch (error: any) {
      const isRateLimit =
        error?.status === 429 ||
        error?.message?.includes('429') ||
        error?.message?.includes('Quota');

      if (isRateLimit) {
        console.warn(
          '⚠️ Gemini 2.5 Flash Rate Limit hit! Switching to Gemini 3.1 Flash Lite...',
        );
        try {
          const fallbackModel = this.genAI.getGenerativeModel({
            model: 'gemini-3.1-flash-lite',
          });
          return await this.executeGeneration(fallbackModel, prompt);
        } catch (fallbackError) {
          console.error('❌ Fallback Model also failed:', fallbackError);
          throw new InternalServerErrorException(
            'All AI services are currently exhausted.',
          );
        }
      }

      console.error('Gemini Primary Error:', error);
      throw new InternalServerErrorException('Failed to generate itinerary.');
    }
  }

  async chatReply(message: string): Promise<{ response: string }> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const prompt = `
        You are StayBook AI Concierge, a bespoke premium luxury travel assistant. 
        Provide a highly intelligent, professional, and elegant response to the user's inquiry.
        Keep the response brief, engaging, and premium (maximum 2-4 sentences).

        User Query: "${message}"
      `;

      const result = await model.generateContent(prompt);
      return { response: result.response.text() };
    } catch (error) {
      console.error('Gemini Chat Error:', error);
      return {
        response:
          'I am experiencing a brief connection issue, but I am ready to assist you shortly.',
      };
    }
  }

  private async executeGeneration(model: any, prompt: string) {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  }
}
