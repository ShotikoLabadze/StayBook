import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TripDocument = Trip & Document;

@Schema({ timestamps: true })
export class Trip {
  @Prop({ default: 'guest-user' })
  userId!: string;

  @Prop({ type: Types.ObjectId, ref: 'Hotel', required: true })
  hotelId!: Types.ObjectId;

  @Prop({ required: true })
  checkIn!: Date;

  @Prop({ required: true })
  checkOut!: Date;

  @Prop({ required: true })
  guests!: number;

  @Prop({ required: true })
  totalPrice!: number;

  @Prop({
    type: [
      {
        dayIndex: Number,
        date: String,
        activities: [
          {
            id: String,
            type: {
              type: String,
              enum: ['flight', 'hotel', 'activity', 'transfer'],
              default: 'activity',
            },
            title: String,
            time: String,
            status: {
              type: String,
              enum: ['pending', 'confirmed'],
              default: 'pending',
            },
            notes: String,
          },
        ],
      },
    ],
    default: [],
  })
  itinerary!: any[];
}

export const TripSchema = SchemaFactory.createForClass(Trip);
