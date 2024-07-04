import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/models/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewRepository extends Repository<ReviewEntity> {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly repository: Repository<ReviewEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  //   async findOneById(reviewId: number): Promise<ReviewEntity | undefined> {
  //     return await this.repository.findOne(reviewId);
  //   }

  async findAllByUserId(userId: number): Promise<ReviewEntity[]> {
    return await this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.writer', 'writer')
      .where('writer.id = :userId', { userId })
      .getMany();
  }

  async findAllByArticleId(articleId: number): Promise<ReviewEntity[]> {
    return await this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.article', 'article')
      .where('article.id = :articleId', { articleId })
      .getMany();
  }
}
