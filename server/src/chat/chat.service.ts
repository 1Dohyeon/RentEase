import { BadRequestException, Injectable } from '@nestjs/common';
import { ArticleService } from 'src/article/article.service';
import { UserService } from 'src/user/user.service';
import { ChatEntity } from '../models/chat.entity';
import { ChatRoomEntity } from '../models/chatroom.entity';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(
    private readonly repository: ChatRepository,
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
  ) {}

  async getChatroom(
    user1Id: number,
    user2Id: number,
    articleId: number,
  ): Promise<ChatRoomEntity> {
    const chatRoom = await this.repository.getChatroom(
      user1Id,
      user2Id,
      articleId,
    );

    if (!chatRoom) {
      throw new BadRequestException('해당 채팅방을 찾을 수 없습니다.');
    }

    return chatRoom;
  }

  async createChatRoom(
    user1Id: number,
    user2Id: number,
    articleId: number,
  ): Promise<ChatRoomEntity> {
    const chatRoom = await this.repository.getChatroom(
      user1Id,
      user2Id,
      articleId,
    );

    if (!chatRoom) {
      const user1 = await this.userService.getUserById(user1Id);
      const user2 = await this.userService.getUserById(user2Id);
      const article = await this.articleService.getArticleById(articleId);

      await this.repository.createChatroom(user1, user2, article);
      return await this.repository.getChatroom(user1Id, user2Id, articleId);
    }

    return chatRoom;
  }

  async getChatroomById(chatRoomId: number): Promise<ChatRoomEntity> {
    const chatRoom = await this.repository.getChatroomById(chatRoomId);

    if (!chatRoom) {
      throw new BadRequestException('해당 채팅방을 찾을 수 없습니다.');
    }

    return chatRoom;
  }

  async addChatMessage(chatRoomId: number, senderId: number, message: string) {
    const chatRoom = await this.repository.getChatroomById(chatRoomId);
    const sender = await this.userService.getUserById(senderId);
    return this.repository.createChat(chatRoom, sender, message);
  }

  async getChatRoomMessages(chatRoomId: number): Promise<ChatEntity[]> {
    const chats = await this.repository.getChatRoomMessages(chatRoomId);

    if (!chats) {
      throw new BadRequestException('채팅 내역을 찾을 수 없습니다.');
    }

    return chats;
  }

  async getUserChatRooms(userId: number): Promise<ChatRoomEntity[]> {
    const chatRooms = await this.repository.getUserChatRooms(userId);

    if (!chatRooms) {
      throw new BadRequestException('채팅방 목록을 찾을 수 없습니다.');
    }

    // 채팅이 없는 채팅방 삭제
    for (const chatRoom of chatRooms) {
      const chats = await this.repository.getChatRoomMessages(chatRoom.id);
      if (chats.length === 0) {
        await this.deleteChatRoom(chatRoom.id);
      }
    }

    // 삭제 후 다시 채팅방 목록 가져오기
    const updatedChatRooms = await this.repository.getUserChatRooms(userId);

    return updatedChatRooms;
  }

  async deleteChatRoom(chatRoomId: number) {
    await this.getChatroomById(chatRoomId);
    await this.repository.deleteChatRoom(chatRoomId);
  }
}
