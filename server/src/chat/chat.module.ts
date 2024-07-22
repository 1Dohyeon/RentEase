import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from 'src/article/article.module';
import { ArticleEntity } from 'src/models/article.entity';
import { UserModule } from 'src/user/user.module';
import { ChatEntity } from '../models/chat.entity';
import { ChatRoomEntity } from '../models/chatroom.entity';
import { UserEntity } from '../models/user.entity';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatEntity,
      ChatRoomEntity,
      UserEntity,
      ArticleEntity,
    ]),
    UserModule,
    ArticleModule,
  ],
  providers: [ChatService, ChatGateway, ChatRepository],
  controllers: [ChatController],
  exports: [ChatService, ChatRepository],
})
export class ChatModule {}
