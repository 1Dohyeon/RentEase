import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timeSince } from 'src/helper/timeSince';
import { ReviewEntity } from 'src/models/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly repository: Repository<ReviewEntity>,
  ) {}

  /**
   * 리뷰 ID로 리뷰 조회
   * @param reviewId 리뷰 ID
   * @returns 리뷰 정보를 반환
   */
  async getReviewById(reviewId: number): Promise<ReviewEntity | undefined> {
    const review = await this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.writer', 'writer')
      .leftJoinAndSelect('review.article', 'article')
      .where('review.id = :id', { id: reviewId })
      .andWhere('review.isDeleted = false')
      .select([
        'review.id',
        'review.content',
        'review.numofstars',
        'review.createdAt',
        'review.createdTimeSince',
        'review.updatedAt',
        'article.id',
        'article.title',
        'writer.id',
        'writer.nickname',
      ])
      .getOne();

    return {
      ...review,
      createdTimeSince: timeSince(review.createdTimeSince),
    };
  }

  /**
   * 작성자 ID로 모든 리뷰 조회
   * @param userId 작성자 ID
   * @returns 작성자가 작성한 모든 리뷰를 반환
   */
  async getAllReviewsByUserId(userId: number): Promise<ReviewEntity[]> {
    const reviews = await this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.writer', 'writer')
      .leftJoinAndSelect('review.article', 'article')
      .where('writer.id = :userId', { userId })
      .andWhere('review.isDeleted = false')
      .orderBy('review.createdTimeSince', 'DESC')
      .select([
        'review.id',
        'review.content',
        'review.numofstars',
        'review.createdTimeSince',
        'article.id',
        'article.title',
        'writer.id',
        'writer.nickname',
      ])
      .getMany();

    return reviews.map((review) => ({
      ...review,
      createdTimeSince: timeSince(review.createdTimeSince),
    }));
  }

  /**
   * 게시글 ID로 모든 리뷰 조회
   * @param articleId 게시글 ID
   * @returns 게시글에 작성된 모든 리뷰를 반환
   */
  async getAllReviewsByArticleId(articleId: number): Promise<ReviewEntity[]> {
    const reviews = await this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.writer', 'writer')
      .leftJoinAndSelect('review.article', 'article')
      .where('article.id = :articleId', { articleId })
      .andWhere('review.isDeleted = false')
      .orderBy('review.createdTimeSince', 'DESC')
      .select([
        'review.id',
        'review.content',
        'review.numofstars',
        'review.createdTimeSince',
        'article.id',
        'article.title',
        'writer.id',
        'writer.nickname',
      ])
      .getMany();

    return reviews.map((review) => ({
      ...review,
      createdTimeSince: timeSince(review.createdTimeSince),
    }));
  }

  /**
   * 새로운 리뷰 작성
   * @param writerId 작성자 ID
   * @param articleId 게시글 ID
   * @param content 리뷰 내용
   * @param numofstars 별점
   * @returns 작성된 리뷰 정보를 반환
   */
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

  /**
   * 리뷰 수정
   * @param reviewId 리뷰 ID
   * @param content 수정할 리뷰 내용
   * @param numofstars 수정할 별점
   */
  async updateReview(reviewId: number, content: string, numofstars: number) {
    await this.repository
      .createQueryBuilder('review')
      .update(ReviewEntity)
      .set({ content: content, numofstars: numofstars })
      .where('id = :id', { id: reviewId })
      .execute();
  }

  /**
   * 리뷰 삭제
   * @param reviewId 리뷰 ID
   */
  async deleteReview(reviewId: number) {
    await this.repository
      .createQueryBuilder('review')
      .update(ReviewEntity)
      .set({ isDeleted: true, deletedAt: () => 'CURRENT_TIMESTAMP' })
      .where('id = :id', { id: reviewId })
      .execute();
  }
}
