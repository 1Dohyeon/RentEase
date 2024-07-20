import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatroomEntity } from './chatroom.entity';
import { UserEntity } from './user.entity';

@Entity()
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'senderid' })
  sender: UserEntity;

  @ManyToOne(() => ChatroomEntity, (chatroom) => chatroom.chats, {
    nullable: false,
  })
  @JoinColumn({ name: 'chatroomid' })
  chatroom: ChatroomEntity;
}
