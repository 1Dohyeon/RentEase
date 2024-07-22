import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatRoomEntity } from './chatroom.entity';
import { UserEntity } from './user.entity';

@Entity('chats')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity)
  sender: UserEntity;

  @ManyToOne(() => ChatRoomEntity, (chatRoom) => chatRoom.chats)
  chatRoom: ChatRoomEntity;
}
