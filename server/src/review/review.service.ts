import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleRepository } from 'src/article/article.repository';
import { ReviewEntity } from 'src/models/review.entity';
import { UserRepository } from 'src/user/user.repository';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly articleRepository: ArticleRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getReviewById(reviewId: number): Promise<ReviewEntity | undefined> {
    return await this.reviewRepository.getReviewById(reviewId);
  }

  async getAllReviewsByUserId(userId: number): Promise<ReviewEntity[]> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const reviews = await this.reviewRepository.getAllReviewsByUserId(userId);

    if (!reviews) {
      throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    }

    return reviews;
  }

  async getAllReviewsByArticleId(articleId: number): Promise<ReviewEntity[]> {
    const article = await this.articleRepository.getArticleById(articleId);

    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const reviews =
      await this.reviewRepository.getAllReviewsByArticleId(articleId);

    if (!reviews) {
      throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    }

    return reviews;
  }

  async createReview(
    writerId: number,
    articleId: number,
    content: string,
    numofstars: number,
  ): Promise<ReviewEntity> {
    const article = await this.articleRepository.getArticleById(articleId);

    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

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
