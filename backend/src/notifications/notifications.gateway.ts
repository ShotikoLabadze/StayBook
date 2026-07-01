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
    origin: 'https://stay-book-gpv2.vercel.app',
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'],
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
  }

  sendNotificationToUser(userId: string, notification: any) {
    if (!this.server) return;

    try {
      this.server.to(userId).emit('newNotification', notification);
    } catch (error) {
      console.error(error);
    }
  }
}
