import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'https://stay-book-gpv2.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('registerUser')
  handleRegisterUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ) {
    client.join(userId);
    console.log(`Socket: User ${userId} connected to personal channel.`);
  }

  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(userId).emit('newNotification', notification);
  }
}
