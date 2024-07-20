import { EntityRepository, Repository } from 'typeorm';
import { ChatEntity } from '../models/chat.entity';

@EntityRepository(ChatEntity)
export class ChatRepository extends Repository<ChatEntity> {}
