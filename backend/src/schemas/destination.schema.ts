import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DestinationDocument = Destination & Document;

@Schema()
class Review {
  @Prop({ required: true })
  author!: string;

  @Prop({ required: true })
  role!: string;

  @Prop({ required: true })
  quote!: string;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating!: number;
}
const ReviewSchema = SchemaFactory.createForClass(Review);

@Schema({ timestamps: true })
export class Destination {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  location!: string;

  @Prop({ required: true, type: Number })
  price!: number;

  @Prop({ type: Number, default: 4.5 })
  rating!: number;

  @Prop({ type: Number, default: 0 })
  reviewsCount!: number;

  @Prop({ required: true })
  image!: string;

  @Prop({ type: [ReviewSchema], default: [] })
  reviews!: Review[];
}

export const DestinationSchema = SchemaFactory.createForClass(Destination);
