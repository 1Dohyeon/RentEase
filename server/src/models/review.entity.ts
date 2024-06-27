import { IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entity/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'reviews',
})
export class ReviewEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', nullable: false })
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  @JoinColumn({ name: 'writerid' })
  writer: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.reviews)
  @JoinColumn({ name: 'articleid' })
  article: ArticleEntity;
}
