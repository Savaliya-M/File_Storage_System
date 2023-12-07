import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  imageStatusUpdated(data: { fileName: string; status: string; size: string }) {
    console.log('in gateway');
    console.log(data);

    this.server.emit('statusUpdate', data);
  }
}
