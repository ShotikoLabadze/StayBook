import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ default: '' })
  avatar!: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role!: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
    default: [],
  })
  favorites!: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
