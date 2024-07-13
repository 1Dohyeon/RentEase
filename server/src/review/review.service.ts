import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ArticleRepository } from 'src/article/article.repository';
import { ArticleService } from 'src/article/article.service';
import { ReviewEntity } from 'src/models/review.entity';
import { UserRepository } from 'src/user/user.repository';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly articleRepository: ArticleRepository,
    private readonly articleService: ArticleService,
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
    const article =
      await this.articleRepository.getArticleDetailById(articleId);

    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 사용자가 이미 작성한 게시글인지 확인
    const existingReview = await this.findReviewByWriterAndArticle(
      writerId,
      articleId,
    );
    if (existingReview) {
      throw new HttpException(
        '이미 리뷰를 작성한 게시글입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const review = await this.reviewRepository.createReview(
      writerId,
      articleId,
      content,
      numofstars,
    );

    if (!review) {
      throw new BadRequestException('리뷰 작성에 실패하였습니다.');
    }

    await this.articleService.updateArticleAvgStars(article.id);

    return review;
  }

  async findReviewByWriterAndArticle(
    writerId: number,
    articleId: number,
  ): Promise<boolean> {
    // 해당 게시글의 모든 리뷰를 가져옴
    const reviews = await this.getAllReviewsByArticleId(articleId);

    // 해당 사용자가 이미 작성한 리뷰가 있는지 확인
    for (const review of reviews) {
      if (review.writer.id === writerId) {
        return true; // 이미 작성한 리뷰가 있으면 true 반환
      }
    }

    return false; // 해당 사용자의 리뷰를 찾지 못하면 false 반환
  }

  async updateReview(
    reviewId: number,
    content: string,
    numofstars: number,
  ): Promise<ReviewEntity> {
    const review = await this.getReviewById(reviewId);

    if (!review) {
      throw new NotFoundException(`해당 리뷰를 찾을 수 없습니다.`);
    }

    const article = await this.articleRepository.getArticleDetailById(
      review.article.id,
    );

    if (!article) {
      throw new NotFoundException(`게시글을 찾을 수 없습니다.`);
    }

    try {
      await this.reviewRepository.updateReview(reviewId, content, numofstars);
      await this.articleService.updateArticleAvgStars(article.id);

      return await this.reviewRepository.getReviewById(reviewId);
    } catch (err) {
      throw new BadRequestException(`업데이트에 실패하였습니다.`);
    }
  }

  async deleteReview(reviewId: number): Promise<ReviewEntity> {
    const review = await this.getReviewById(reviewId);

    if (!review) {
      throw new NotFoundException(`해당 리뷰를 찾을 수 없습니다.`);
    }

    const article = await this.articleRepository.getArticleDetailById(
      review.article.id,
    );

    if (!article) {
      throw new NotFoundException(`게시글을 찾을 수 없습니다.`);
    }

    try {
      await this.reviewRepository.deleteReview(reviewId);
      await this.articleService.updateArticleAvgStars(article.id);
      return review;
    } catch (err) {
      throw new BadRequestException(`삭제에 실패하였습니다.`);
    }
  }
}
