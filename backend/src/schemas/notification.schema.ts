import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  recipient!: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  message!: string;

  @Prop({ required: true, enum: ['invite', 'comment', 'system'] })
  type!: string;

  @Prop({ default: false })
  isRead!: boolean;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  metadata?: any;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
