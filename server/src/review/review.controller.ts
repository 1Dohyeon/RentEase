import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ReviewEntity } from 'src/models/review.entity';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * 리뷰 ID로 리뷰를 조회
   * @param reviewId 리뷰 ID
   * @returns 리뷰 정보를 반환
   */
  @Get('/:reviewId')
  async getReviewById(
    @Param('reviewId') reviewId: number,
  ): Promise<ReviewEntity> {
    return await this.reviewService.getReviewById(reviewId);
  }

  /**
   * 작성자 ID로 모든 리뷰를 조회
   * @param writerId 작성자 ID
   * @returns 작성자가 작성한 모든 리뷰를 반환
   */
  @Get('/writers/:writerId')
  async getAllReviewsByUserId(
    @Param('writerId') writerId: number,
  ): Promise<ReviewEntity[]> {
    return await this.reviewService.getAllReviewsByUserId(writerId);
  }

  /**
   * 게시글 ID로 모든 리뷰를 조회
   * @param articleId 게시글 ID
   * @returns 게시글에 작성된 모든 리뷰를 반환
   */
  @Get()
  async getAllReviewsByArticleId(
    @Query('articleId') articleId: number,
  ): Promise<ReviewEntity[]> {
    return await this.reviewService.getAllReviewsByArticleId(articleId);
  }

  /**
   * 새로운 리뷰 작성
   * @param req 요청 객체
   * @param articleId 게시글 ID
   * @param content 리뷰 내용
   * @param numofstars 별점
   * @returns 작성된 리뷰 정보를 반환
   */
  @Post('/write')
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Request() req,
    @Query('articleId') articleId: number,
    @Body('content') content: string,
    @Body('numofstars') numofstars: number,
  ) {
    return this.reviewService.createReview(
      req.user.id,
      articleId,
      content,
      numofstars,
    );
  }

  /**
   * 리뷰 수정
   * @param reviewId 리뷰 ID
   * @param content 수정할 리뷰 내용
   * @param numofstars 수정할 별점
   * @returns 수정된 리뷰 정보를 반환
   */
  @Patch(':reviewId/edit')
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @Param('reviewId') reviewId: number,
    @Body('content') content: string,
    @Body('numofstars') numofstars: number,
  ): Promise<ReviewEntity> {
    return this.reviewService.updateReview(reviewId, content, numofstars);
  }

  /**
   * 리뷰 삭제
   * @param reviewId 리뷰 ID
   * @returns 삭제된 리뷰 정보를 반환
   */
  @Patch('/:reviewId')
  @UseGuards(JwtAuthGuard)
  async deleteReview(
    @Param('reviewId') reviewId: number,
  ): Promise<ReviewEntity> {
    return this.reviewService.deleteReview(reviewId);
  }
}
