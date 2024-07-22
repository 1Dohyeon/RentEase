import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * 채팅방을 생성
   * @param user1Id 첫 번째 유저 ID
   * @param user2Id 두 번째 유저 ID
   * @param articleId 게시글 ID
   * @returns 생성된 채팅방 정보를 반환
   */
  @Post('rooms')
  @UseGuards(JwtAuthGuard)
  async createChatRoom(
    @Body('user1Id') user1Id: number,
    @Body('user2Id') user2Id: number,
    @Body('articleId') articleId: number,
  ) {
    return this.chatService.createChatRoom(user1Id, user2Id, articleId);
  }

  /**
   * 채팅방에 메시지를 추가
   * @param roomId 채팅방 ID
   * @param senderId 보낸 사람의 유저 ID
   * @param message 추가할 메시지 내용
   * @returns 추가된 메시지 정보를 반환
   */
  @Post('rooms/:roomId/messages')
  @UseGuards(JwtAuthGuard)
  async addChatMessage(
    @Param('roomId') roomId: number,
    @Body('senderId') senderId: number,
    @Body('message') message: string,
  ) {
    return this.chatService.addChatMessage(roomId, senderId, message);
  }

  /**
   * 채팅방의 모든 메시지를 불러옴
   * @param roomId 채팅방 ID
   * @returns 채팅방의 모든 메시지 리스트를 반환
   */
  @Get('rooms/:roomId/messages')
  @UseGuards(JwtAuthGuard)
  async getChatRoomMessages(@Param('roomId') roomId: number) {
    return this.chatService.getChatRoomMessages(roomId);
  }

  /**
   * 특정 유저가 속한 모든 채팅방을 불러옴
   * @param userId 유저 ID
   * @returns 유저가 속한 채팅방 리스트를 반환
   */
  @Get('rooms/users/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserChatRooms(@Param('userId') userId: number) {
    return this.chatService.getUserChatRooms(userId);
  }
}
