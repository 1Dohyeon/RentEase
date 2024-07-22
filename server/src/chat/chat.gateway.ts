import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody('roomId') roomId: number,
    @MessageBody('senderId') senderId: number,
    @MessageBody('message') message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const chatMessage = await this.chatService.addChatMessage(
      roomId,
      senderId,
      message,
    );
    this.server.to(`room-${roomId}`).emit('receiveMessage', chatMessage);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody('roomId') roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`room-${roomId}`);
  }
}
