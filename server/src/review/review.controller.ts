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

  @Get('/:reviewId')
  async getReviewById(
    @Param('reviewId') reviewId: number,
  ): Promise<ReviewEntity> {
    return await this.reviewService.getReviewById(reviewId);
  }

  @Get('/writers/:writerId')
  async getAllReviewsByUserId(
    @Param('writerId') writerId: number,
  ): Promise<ReviewEntity[]> {
    return await this.reviewService.getAllReviewsByUserId(writerId);
  }

  @Get()
  async getAllReviewsByArticleId(
    @Query('articleId') articleId: number,
  ): Promise<ReviewEntity[]> {
    return await this.reviewService.getAllReviewsByArticleId(articleId);
  }

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

  @Patch(':reviewId/edit')
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @Param('reviewId') reviewId: number,
    @Body('content') content: string,
    @Body('numofstars') numofstars: number,
  ): Promise<ReviewEntity> {
    return this.reviewService.updateReview(reviewId, content, numofstars);
  }

  @Patch('/:reviewId')
  @UseGuards(JwtAuthGuard)
  async deleteReview(
    @Param('reviewId') reviewId: number,
  ): Promise<ReviewEntity> {
    return this.reviewService.deleteReview(reviewId);
  }
}
