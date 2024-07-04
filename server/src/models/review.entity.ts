import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
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

  @IsInt()
  @Min(1, { message: '별점은 최소 1이어야 합니다.' })
  @Max(5, { message: '별점은 최대 5이어야 합니다.' })
  @Column({ type: 'int', nullable: false })
  numofstars: number;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  @JoinColumn({ name: 'writerid' })
  writer: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.reviews)
  @JoinColumn({ name: 'articleid' })
  article: ArticleEntity;
}
