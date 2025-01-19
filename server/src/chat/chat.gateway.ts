import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*', // 필요한 도메인으로 제한 가능
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  /**
   * 클라이언트 연결 처리
   * @param client 클라이언트 소켓
   */
  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  /**
   * 클라이언트 연결 해제 처리
   * @param client 클라이언트 소켓
   */
  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  /**
   * 메시지 전송 이벤트 처리
   * @param client 클라이언트 소켓
   * @param payload 클라이언트에서 전달된 데이터
   */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      chatRoomId: number;
      sender: {
        id: number;
        profileimage: string;
      };
      message: string;
    },
  ) {
    const { chatRoomId, sender, message } = payload;

    try {
      // db에 메시지 저장
      const savedMessage = await this.chatService.saveMessage(
        chatRoomId,
        sender.id,
        message,
      );

      // 새로운 메시지를 chatRoom-${chatRoomId}에 있는
      // 모든 클라이언트에게 브로드캐스트
      this.server.to(`chatRoom-${chatRoomId}`).emit('newMessage', {
        sender: {
          id: savedMessage.sender.id, // sender.id 전송
          profileimage: savedMessage.sender.profileimage,
        },
        message,
      });
    } catch (error) {
      console.error('Error saving message:', error);

      // 클라이언트에게 에러 메시지 전송
      client.emit('error', {
        message: '메시지를 전송하는 중 오류가 발생했습니다.',
      });
    }
  }

  /**
   * 클라이언트가 채팅방에 참여
   * @param client 클라이언트 소켓
   * @param payload 클라이언트에서 전달된 데이터
   */
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatRoomId: number },
  ) {
    const { chatRoomId } = payload;
    try {
      // 채팅방에 참여
      client.join(`chatRoom-${chatRoomId}`);
      // 채팅방의 기존 메시지 조회
      const messages = await this.chatService.getChatRoomMessages(chatRoomId);

      // 기존 메시지를 클라이언트에게 전송
      client.emit('joinedRoom', { chatRoomId });
      client.emit('existingMessages', messages);
      console.log(`Client ${client.id} joined chatRoom-${chatRoomId}`);
    } catch (error) {
      client.emit('error', {
        message: '채팅방에 참여하는 중 오류가 발생했습니다.',
      });
    }
  }

  /**
   * 클라이언트가 채팅방을 떠남
   * @param client 클라이언트 소켓
   * @param payload 클라이언트에서 전달된 데이터
   */
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatRoomId: number },
  ) {
    const { chatRoomId } = payload;

    try {
      // 클라이언트를 채팅방 소켓 룸에서 제거
      client.emit('leftRoom', { chatRoomId });
      client.leave(`chatRoom-${chatRoomId}`);
      console.log(`Client ${client.id} left chatRoom-${chatRoomId}`);
    } catch (error) {
      client.emit('error', {
        message: '채팅방을 떠나는 중 오류가 발생했습니다.',
      });
    }
  }
}
