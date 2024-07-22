import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/models/article.entity';
import { ChatRoomEntity } from 'src/models/chatroom.entity';
import { UserEntity } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { ChatEntity } from '../models/chat.entity';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(ChatRoomEntity)
    private readonly chatRoomRepository: Repository<ChatRoomEntity>,
  ) {}

  async getChatroom(
    user1Id: number,
    user2Id: number,
    articleId: number,
  ): Promise<ChatRoomEntity> {
    return await this.chatRoomRepository.findOne({
      where: [
        {
          user1: { id: user1Id },
          user2: { id: user2Id },
          article: { id: articleId },
        },
        {
          user1: { id: user2Id },
          user2: { id: user1Id },
          article: { id: articleId },
        },
      ],
    });
  }

  async getChatroomById(chatRoomId: number): Promise<ChatRoomEntity> {
    return await this.chatRoomRepository.findOne({
      where: { id: chatRoomId },
    });
  }

  async createChatroom(
    user1: UserEntity,
    user2: UserEntity,
    article: ArticleEntity,
  ): Promise<ChatRoomEntity> {
    const chatRoom = this.chatRoomRepository.create({
      user1,
      user2,
      article,
    });
    await this.chatRoomRepository.save(chatRoom);
    return chatRoom;
  }

  async createChat(
    chatRoom: ChatRoomEntity,
    sender: UserEntity,
    message: string,
  ) {
    const chatMessage = this.chatRepository.create({
      chatRoom,
      sender,
      message,
    });
    const savedChatMessage = await this.chatRepository.save(chatMessage);
    return {
      message: savedChatMessage.message,
      senderId: sender.id,
      createdAt: savedChatMessage.createdAt,
    };
  }

  async getChatRoomMessages(chatRoomId: number): Promise<ChatEntity[]> {
    return await this.chatRepository.find({
      where: { chatRoom: { id: chatRoomId } },
      relations: ['sender'],
    });
  }

  async getUserChatRooms(userId: number): Promise<ChatRoomEntity[]> {
    return this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .leftJoinAndSelect('chatRoom.user1', 'user1')
      .leftJoinAndSelect('chatRoom.user2', 'user2')
      .leftJoinAndSelect('chatRoom.article', 'article')
      .where('user1.id = :userId OR user2.id = :userId', { userId })
      .andWhere('article.isDeleted = false')
      .orderBy('chatRoom.createdAt', 'DESC')
      .getMany();
  }

  async deleteChatRoom(chatRoomId: number): Promise<void> {
    await this.chatRoomRepository
      .createQueryBuilder()
      .delete()
      .from(ChatRoomEntity)
      .where('id = :chatRoomId', { chatRoomId })
      .execute();
  }
}
