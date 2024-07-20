import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';

@Entity('chatrooms')
export class ChatRoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity)
  user1: UserEntity;

  @ManyToOne(() => UserEntity)
  user2: UserEntity;

  @OneToMany(() => ChatEntity, (chat) => chat.chatRoom)
  chats: ChatEntity[];
}
