import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity } from '../models/chat.entity';
import { ChatRoomEntity } from '../models/chatroom.entity';
import { UserEntity } from '../models/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(ChatRoomEntity)
    private readonly chatRoomRepository: Repository<ChatRoomEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createChatRoom(
    user1Id: number,
    user2Id: number,
  ): Promise<ChatRoomEntity> {
    let chatRoom = await this.chatRoomRepository.findOne({
      where: [
        { user1: { id: user1Id }, user2: { id: user2Id } },
        { user1: { id: user2Id }, user2: { id: user1Id } },
      ],
    });

    if (!chatRoom) {
      const user1 = await this.userRepository.findOne({
        where: { id: user1Id },
      });
      const user2 = await this.userRepository.findOne({
        where: { id: user2Id },
      });
      chatRoom = this.chatRoomRepository.create({ user1, user2 });
      await this.chatRoomRepository.save(chatRoom);
    }
    return chatRoom;
  }

  async addChatMessage(
    chatRoomId: number,
    senderId: number,
    message: string,
  ): Promise<ChatEntity> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: chatRoomId },
    });
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    const chatMessage = this.chatRepository.create({
      chatRoom,
      sender,
      message,
    });
    return this.chatRepository.save(chatMessage);
  }

  async getChatRoomMessages(chatRoomId: number): Promise<ChatEntity[]> {
    return this.chatRepository.find({
      where: { chatRoom: { id: chatRoomId } },
      relations: ['sender'],
    });
  }

  async getUserChatRooms(userId: number): Promise<ChatRoomEntity[]> {
    return this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .leftJoinAndSelect('chatRoom.user1', 'user1')
      .leftJoinAndSelect('chatRoom.user2', 'user2')
      .where('user1.id = :userId OR user2.id = :userId', { userId })
      .getMany();
  }
}
