import { CommonEntity } from 'src/common/entity/common.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity('categories')
export class CategoryEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @ManyToMany(() => ArticleEntity, (article) => article.categories)
  articles: ArticleEntity[];
}
