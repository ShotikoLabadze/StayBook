import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HotelDocument = Hotel & Document;

@Schema({ timestamps: true })
export class Hotel {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  destinationId!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  neighborhood!: string;

  @Prop({ required: true })
  image!: string;

  @Prop({ type: [String], default: [] })
  gallery!: string[];

  @Prop({ type: Number, default: 4.5 })
  rating!: number;

  @Prop({ type: Number, default: 0 })
  reviewCount!: number;

  @Prop({ type: Number, required: true })
  pricePerNight!: number;

  @Prop({ default: 'USD' })
  currency!: string;

  @Prop()
  propertyType!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: [String], default: [] })
  amenities!: string[];

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

  @Prop()
  description!: string;

  @Prop({ type: [String], default: [] })
  highlights!: string[];
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
