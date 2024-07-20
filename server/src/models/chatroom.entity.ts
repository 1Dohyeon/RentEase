import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';

@Entity()
export class ChatroomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'userid1' })
  userid1: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'userid2' })
  userid2: UserEntity;

  @OneToMany(() => ChatEntity, (chat) => chat.chatroom)
  chats: ChatEntity[];
}
