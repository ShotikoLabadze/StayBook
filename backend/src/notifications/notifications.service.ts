import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../schemas/notification.schema';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notifModel: Model<NotificationDocument>,
    private notifGateway: NotificationsGateway,
  ) {}

  async createAndSend(
    recipientId: string,
    title: string,
    message: string,
    type: string,
    metadata?: any,
  ) {
    const notif = new this.notifModel({
      recipient: new Types.ObjectId(recipientId),
      title,
      message,
      type,
      metadata,
    });
    await notif.save();

    this.notifGateway.sendNotificationToUser(recipientId, notif);
    return notif;
  }
  async getUserNotifications(userId: string) {
    return this.notifModel
      .find({ recipient: new Types.ObjectId(userId) } as any)
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(notifId: string) {
    return this.notifModel
      .findByIdAndUpdate(notifId, { isRead: true }, { new: true })
      .exec();
  }
}
