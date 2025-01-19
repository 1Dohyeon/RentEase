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
