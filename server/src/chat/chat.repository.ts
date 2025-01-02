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

  /**
   * 두 유저와 게시글에 해당하는 채팅방을 가져옴
   * @param user1Id 첫 번째 유저 ID
   * @param user2Id 두 번째 유저 ID
   * @param articleId 게시글 ID
   * @returns 채팅방 정보를 반환
   */
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

  /**
   * 채팅방 ID로 채팅방 정보를 가져옴
   * @param chatRoomId 채팅방 ID
   * @returns 채팅방 정보를 반환
   */
  async getChatroomById(chatRoomId: number): Promise<ChatRoomEntity> {
    return await this.chatRoomRepository.findOne({
      where: { id: chatRoomId },
    });
  }

  /**
   * 새로운 채팅방을 생성
   * @param user1 첫 번째 유저 엔티티
   * @param user2 두 번째 유저 엔티티
   * @param article 게시글 엔티티
   * @returns 생성된 채팅방 정보를 반환
   */
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

  /**
   * 채팅방에 메시지를 추가
   * @param chatRoom 채팅방 엔티티
   * @param sender 메시지를 보낸 유저 엔티티
   * @param message 추가할 메시지 내용
   * @returns 추가된 메시지 정보를 반환
   */
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
      senderProfileImage: sender.profileimage,
      createdAt: savedChatMessage.createdAt,
    };
  }

  /**
   * 채팅방의 모든 메시지를 불러옴
   * @param chatRoomId 채팅방 ID
   * @returns 채팅방의 모든 메시지 리스트를 반환
   */
  async getChatRoomMessages(chatRoomId: number): Promise<ChatEntity[]> {
    return await this.chatRepository.find({
      where: { chatRoom: { id: chatRoomId } },
      relations: ['sender'],
    });
  }

  /**
   * 특정 유저가 속한 모든 채팅방을 불러옴
   * @param userId 유저 ID
   * @returns 유저가 속한 채팅방 리스트를 반환
   */
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

  /**
   * 채팅방을 삭제
   * @param chatRoomId 채팅방 ID
   */
  async deleteChatRoom(chatRoomId: number): Promise<void> {
    await this.chatRoomRepository
      .createQueryBuilder()
      .delete()
      .from(ChatRoomEntity)
      .where('id = :chatRoomId', { chatRoomId })
      .execute();
  }
}
