import {
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'bookmark' })
export class BookmarkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'writerid' })
  user: UserEntity;

  @ManyToMany(() => ArticleEntity, (article) => article.bookmarks)
  articles: ArticleEntity[];
}
