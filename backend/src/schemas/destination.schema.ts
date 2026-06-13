import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DestinationDocument = Destination & Document;

@Schema({ _id: false })
class Weather {
  @Prop({ type: Number })
  temp!: number;

  @Prop()
  unit!: string;

  @Prop()
  condition!: string;
}

@Schema({ timestamps: true })
export class Destination {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  slug!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  country!: string;

  @Prop({ required: true })
  region!: string;

  @Prop()
  tagline!: string;

  @Prop()
  description!: string;

  @Prop({ required: true })
  image!: string;

  @Prop({ type: [String], default: [] })
  gallery!: string[];

  @Prop({
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: true,
  })
  coordinates!: {
    lat: number;
    lng: number;
  };

  @Prop({ type: Number, required: true })
  pricePerNight!: number;

  @Prop({ default: 'USD' })
  currency!: string;

  @Prop({ type: Number, default: 4.5 })
  rating!: number;

  @Prop({ type: Number, default: 0 })
  reviewCount!: number;

  @Prop()
  category!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: [String], default: [] })
  activities!: string[];

  @Prop()
  duration!: string;

  @Prop({ type: Weather })
  weather!: Weather;

  @Prop()
  flightTime!: string;

  @Prop()
  bestSeason!: string;

  @Prop({ type: [String], default: [] })
  highlights!: string[];

  @Prop({ type: Boolean, default: false })
  featured!: boolean;

  @Prop({ type: [String], default: [] })
  tips!: string[];
}

export const DestinationSchema = SchemaFactory.createForClass(Destination);
