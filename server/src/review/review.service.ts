import { Injectable } from '@nestjs/common';
import { ReviewEntity } from 'src/models/review.entity';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async getReviewById(reviewId: number): Promise<ReviewEntity | undefined> {
    return await this.reviewRepository.getReviewById(reviewId);
  }

  async getAllReviewsByUserId(userId: number): Promise<ReviewEntity[]> {
    return await this.reviewRepository.getAllReviewsByUserId(userId);
  }

  async getAllReviewsByArticleId(articleId: number): Promise<ReviewEntity[]> {
    return await this.reviewRepository.getAllReviewsByArticleId(articleId);
  }

  async createReview(
    writerId: number,
    articleId: number,
    content: string,
    numofstars: number,
  ): Promise<ReviewEntity> {
    return await this.reviewRepository.createReview(
      writerId,
      articleId,
      content,
      numofstars,
    );
  }

  //   async updateReview(
  //     reviewId: number,
  //     content: string,
  //     numofstars: number,
  //   ): Promise<ReviewEntity> {
  //     const review = await this.findOneById(reviewId);
  //     if (!review) {
  //       throw new NotFoundException(`Review with ID ${reviewId} not found.`);
  //     }

  //     review.content = content;
  //     review.numofstars = numofstars;

  //     return await this.reviewRepository.save(review);
  //   }

  //   async deleteReview(reviewId: number): Promise<void> {
  //     const review = await this.findOneById(reviewId);
  //     if (!review) {
  //       throw new NotFoundException(`Review with ID ${reviewId} not found.`);
  //     }

  //     await await this.reviewRepository.remove(review);
  //   }
}
