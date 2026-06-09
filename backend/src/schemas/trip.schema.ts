import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TripDocument = Trip & Document;

@Schema()
class Activity {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ default: '' })
  note!: string;

  @Prop({ default: '' })
  time!: string;

  @Prop({ default: 0 })
  cost!: number;

  @Prop({
    required: true,
    enum: ['hotel', 'flight', 'food', 'activity', 'transport'],
  })
  category!: string;

  @Prop({
    type: {
      name: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: true,
  })
  location!: {
    name: string;
    lat: number;
    lng: number;
  };
}
const ActivitySchema = SchemaFactory.createForClass(Activity);

@Schema()
class ItineraryDay {
  @Prop({ required: true })
  dayNumber!: number;

  @Prop({ required: true })
  date!: Date;

  @Prop({ type: [ActivitySchema], default: [] })
  activities!: Activity[];
}
const ItineraryDaySchema = SchemaFactory.createForClass(ItineraryDay);

@Schema({ timestamps: true })
export class Trip {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  destination!: string;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner!: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  collaborators!: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [ItineraryDaySchema], default: [] })
  itinerary!: ItineraryDay[];

  @Prop({
    type: {
      totalLimit: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
    },
  })
  budget!: {
    totalLimit: number;
    currency: string;
  };
}

export const TripSchema = SchemaFactory.createForClass(Trip);
