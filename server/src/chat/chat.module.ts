import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from '../models/chat.entity';
import { ChatRoomEntity } from '../models/chatroom.entity';
import { UserEntity } from '../models/user.entity';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity, ChatRoomEntity, UserEntity])],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
