import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DestinationDocument = Destination & Document;

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
  reviews!: number;

  @Prop({ required: true })
  image!: string;
}

export const DestinationSchema = SchemaFactory.createForClass(Destination);
