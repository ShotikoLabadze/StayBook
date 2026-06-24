import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user!: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  targetId!: string;

  @Prop({ required: true, enum: ['hotel', 'destination'] })
  targetType!: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating!: number;

  @Prop({ required: true, trim: true })
  comment!: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
