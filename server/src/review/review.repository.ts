import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/models/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly repository: Repository<ReviewEntity>,
  ) {}

  async getReviewById(reviewId: number): Promise<ReviewEntity | undefined> {
    return await this.repository
      .createQueryBuilder('review')
      .where('review.id = :id', { id: reviewId })
      .getOne();
  }

  async getAllReviewsByUserId(userId: number): Promise<ReviewEntity[]> {
    return await this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.writer', 'writer')
      .where('writer.id = :userId', { userId })
      .andWhere('review.isDeleted = false')
      .getMany();
  }

  async getAllReviewsByArticleId(articleId: number): Promise<ReviewEntity[]> {
    return await this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.article', 'article')
      .where('article.id = :articleId', { articleId })
      .andWhere('review.isDeleted = false')
      .getMany();
  }

  async createReview(
    writerId: number,
    articleId: number,
    content: string,
    numofstars: number,
  ): Promise<ReviewEntity> {
    const review = this.repository.create({
      content,
      numofstars,
      writer: { id: writerId },
      article: { id: articleId },
    });
    return await this.repository.save(review);
  }
}
