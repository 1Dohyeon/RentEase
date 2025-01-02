import { BadRequestException, Injectable } from '@nestjs/common';
import { ArticleService } from 'src/article/article.service';
import { ChatEntity } from 'src/models/chat.entity';
import { UserService } from 'src/user/user.service';
import { ChatRoomEntity } from '../models/chatroom.entity';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
  ) {}

  /**
   * 두 유저와 게시글에 해당하는 채팅방을 가져옴
   * @param user1Id 첫 번째 유저 ID
   * @param user2Id 두 번째 유저 ID
   * @param articleId 게시글 ID
   * @returns 해당 채팅방 정보를 반환
   * @throws BadRequestException 해당 채팅방을 찾을 수 없을 때
   */
  async getChatroom(
    user1Id: number,
    user2Id: number,
    articleId: number,
  ): Promise<ChatRoomEntity> {
    const chatRoom = await this.chatRepository.getChatroom(
      user1Id,
      user2Id,
      articleId,
    );

    if (!chatRoom) {
      throw new BadRequestException('해당 채팅방을 찾을 수 없습니다.');
    }

    return chatRoom;
  }

  /**
   * 채팅방을 생성
   * @param user1Id 첫 번째 유저 ID
   * @param user2Id 두 번째 유저 ID
   * @param articleId 게시글 ID
   * @returns 생성된 채팅방 정보를 반환
   */
  async createChatRoom(
    user1Id: number,
    user2Id: number,
    articleId: number,
  ): Promise<ChatRoomEntity> {
    const chatRoom = await this.chatRepository.getChatroom(
      user1Id,
      user2Id,
      articleId,
    );

    if (!chatRoom) {
      const user1 = await this.userService.getUserById(user1Id);
      const user2 = await this.userService.getUserById(user2Id);
      const article = await this.articleService.getArticleById(articleId);

      await this.chatRepository.createChatroom(user1, user2, article);
      return await this.chatRepository.getChatroom(user1Id, user2Id, articleId);
    }

    return chatRoom;
  }

  /**
   * 채팅방 ID로 채팅방 정보를 가져옴
   * @param chatRoomId 채팅방 ID
   * @returns 해당 채팅방 정보를 반환
   * @throws BadRequestException 해당 채팅방을 찾을 수 없을 때
   */
  async getChatroomById(chatRoomId: number): Promise<ChatRoomEntity> {
    const chatRoom = await this.chatRepository.getChatroomById(chatRoomId);

    if (!chatRoom) {
      throw new BadRequestException('해당 채팅방을 찾을 수 없습니다.');
    }

    return chatRoom;
  }

  // 메시지 저장
  async saveMessage(chatRoomId: number, senderId: number, message: string) {
    const chatRoom = await this.getChatroomById(chatRoomId); // 채팅방 검증
    const sender = await this.userService.getUserById(senderId); // 유저 검증 (필요 시)

    // Repository에 메시지 생성 요청
    return this.chatRepository.createChat(chatRoom, sender, message);
  }

  /**
   * 채팅방의 모든 메시지를 불러옴
   * @param chatRoomId 채팅방 ID
   * @returns 채팅방의 모든 메시지 리스트를 반환
   * @throws BadRequestException 채팅 내역을 찾을 수 없을 때
   */
  async getChatRoomMessages(chatRoomId: number): Promise<ChatEntity[]> {
    const chats = await this.chatRepository.getChatRoomMessages(chatRoomId);

    if (!chats) {
      throw new BadRequestException('채팅 내역을 찾을 수 없습니다.');
    }

    return chats;
  }

  // /**
  //  * 채팅방에 메시지를 추가
  //  * @param chatRoomId 채팅방 ID
  //  * @param senderId 보낸 사람의 유저 ID
  //  * @param message 추가할 메시지 내용
  //  * @returns 추가된 메시지 정보를 반환
  //  */
  // async addChatMessage(chatRoomId: number, senderId: number, message: string) {
  //   const chatRoom = await this.repository.getChatroomById(chatRoomId);
  //   const sender = await this.userService.getUserById(senderId);
  //   return this.repository.createChat(chatRoom, sender, message);
  // }

  /**
   * 특정 유저가 속한 모든 채팅방을 불러옴
   * @param userId 유저 ID
   * @returns 유저가 속한 채팅방 리스트를 반환
   * @throws BadRequestException 채팅방 목록을 찾을 수 없을 때
   */
  async getUserChatRooms(userId: number): Promise<ChatRoomEntity[]> {
    const chatRooms = await this.chatRepository.getUserChatRooms(userId);

    if (!chatRooms) {
      throw new BadRequestException('채팅방 목록을 찾을 수 없습니다.');
    }

    // 채팅이 없는 채팅방 삭제
    for (const chatRoom of chatRooms) {
      const chats = await this.chatRepository.getChatRoomMessages(chatRoom.id);
      if (chats.length === 0) {
        await this.deleteChatRoom(chatRoom.id);
      }
    }

    // 삭제 후 다시 채팅방 목록 가져오기
    const updatedChatRooms = await this.chatRepository.getUserChatRooms(userId);

    return updatedChatRooms;
  }

  /**
   * 채팅방을 삭제
   * @param chatRoomId 채팅방 ID
   */
  async deleteChatRoom(chatRoomId: number) {
    await this.getChatroomById(chatRoomId);
    await this.chatRepository.deleteChatRoom(chatRoomId);
  }
}
