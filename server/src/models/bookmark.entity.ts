import { CommonEntity } from 'src/common/entity/common.entity';
import {
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'bookmarks' })
export class BookmarkEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userid' })
  user: UserEntity;

  @ManyToMany(() => ArticleEntity, (article) => article.bookmarks)
  articles: ArticleEntity[];
}
