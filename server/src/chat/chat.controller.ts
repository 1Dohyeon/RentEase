import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('rooms')
  @UseGuards(JwtAuthGuard)
  async createChatRoom(
    @Body('user1Id') user1Id: number,
    @Body('user2Id') user2Id: number,
  ) {
    return this.chatService.createChatRoom(user1Id, user2Id);
  }

  @Post('rooms/:roomId/messages')
  @UseGuards(JwtAuthGuard)
  async addChatMessage(
    @Param('roomId') roomId: number,
    @Body('senderId') senderId: number,
    @Body('message') message: string,
  ) {
    return this.chatService.addChatMessage(roomId, senderId, message);
  }

  @Get('rooms/:roomId/messages')
  @UseGuards(JwtAuthGuard)
  async getChatRoomMessages(@Param('roomId') roomId: number) {
    return this.chatService.getChatRoomMessages(roomId);
  }

  @Get('rooms/user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserChatRooms(@Param('userId') userId: number) {
    return this.chatService.getUserChatRooms(userId);
  }
}
