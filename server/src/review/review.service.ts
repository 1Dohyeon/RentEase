import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewEntity } from 'src/models/review.entity';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async findOneById(reviewId: number): Promise<ReviewEntity | undefined> {
    return this.reviewRepository.findOneById(reviewId);
  }

  async findAllByUserId(userId: number): Promise<ReviewEntity[]> {
    return this.reviewRepository.findAllByUserId(userId);
  }

  async findAllByArticleId(articleId: number): Promise<ReviewEntity[]> {
    return this.reviewRepository.findAllByArticleId(articleId);
  }

  async createReview(
    content: string,
    numofstars: number,
    writerId: number,
    articleId: number,
  ): Promise<ReviewEntity> {
    const review = new ReviewEntity();
    review.content = content;
    review.numofstars = numofstars;
    review.writer = { id: writerId } as any;
    review.article = { id: articleId } as any;
    return this.reviewRepository.save(review);
  }

  async updateReview(
    reviewId: number,
    content: string,
    numofstars: number,
  ): Promise<ReviewEntity> {
    const review = await this.findOneById(reviewId);
    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found.`);
    }

    review.content = content;
    review.numofstars = numofstars;

    return this.reviewRepository.save(review);
  }

  async deleteReview(reviewId: number): Promise<void> {
    const review = await this.findOneById(reviewId);
    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found.`);
    }

    await this.reviewRepository.remove(review);
  }
}
