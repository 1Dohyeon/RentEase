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
import { AddressEntity } from 'src/models/address.entity';
import {
  ArticleBanner,
  ArticleDetail,
  ArticleEntity,
  Currency,
} from 'src/models/article.entity';
import { CategoryEntity } from 'src/models/category.entity';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  /**
   * 모든 게시글 조회
   */
  @Get()
  async getAllArticles(): Promise<ArticleBanner[]> {
    return await this.articleService.getAllArticles();
  }

  /**
   * 특정 카테고리에 속한 게시글 조회
   * 예: /articles/category?categoryId=1
   */
  @Get('category')
  async getArticlesByCategory(
    @Query('categoryId') categoryId: number,
  ): Promise<ArticleBanner[]> {
    return await this.articleService.getArticlesByCategory(categoryId);
  }

  /**
   * 사용자 주소 정보와 동일한 게시글만 조회
   * 예: /articles/location?location=true
   */
  @Get('location')
  @UseGuards(JwtAuthGuard)
  async getArticlesByLocation(
    @Request() req,
    @Query('isLocation') isLocation: boolean,
  ): Promise<ArticleBanner[]> {
    return await this.articleService.getArticlesByLocation(
      req.user.id,
      isLocation,
    );
  }

  /**
   * 특정 카테고리에서 사용자 주소 정보와 동일한 게시글만 조회
   * 예: /articles/category-location?category=1&location=true
   */
  @Get('category-location')
  @UseGuards(JwtAuthGuard)
  async getArticlesByCategoryAndLocation(
    @Query('categoryId') categoryId: number,
    @Request() req,
    @Query('isLocation') isLocation: boolean,
  ): Promise<ArticleBanner[]> {
    return await this.articleService.getArticlesByCategoryAndLocation(
      req.user.id,
      categoryId,
      isLocation,
    );
  }

  /**
   * 게시글 작성
   */
  @Post('write')
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @Request() req,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('dailyprice') dailyprice: number,
    @Body('currency') currency: Currency,
    @Body('addresses') addresses: AddressEntity[],
    @Body('categories') categories: CategoryEntity[],
    @Body('weeklyprice') weeklyprice?: number,
    @Body('monthlyprice') monthlyprice?: number,
  ): Promise<ArticleEntity> {
    return await this.articleService.createArticle(
      req.user.id,
      title,
      content,
      dailyprice,
      currency,
      addresses,
      categories,
      weeklyprice,
      monthlyprice,
    );
  }

  /**
   * article 정보 불러옴
   */
  @Get(':articleId')
  async getArticleDetailById(
    @Param('articleId') articleId: number,
  ): Promise<ArticleDetail | undefined> {
    return await this.articleService.getArticleDetailById(articleId);
  }

  /**
   * 특정 article 삭제 (소프트 삭제)
   */
  @Patch('delete/:articleId')
  @UseGuards(JwtAuthGuard)
  async deleteArticleById(
    @Param('articleId') articleId: number,
  ): Promise<ArticleEntity | undefined> {
    return await this.articleService.deleteArticleById(articleId);
  }

  /**
   * 프로필 업데이트
   */
  @Patch('edit/:articleId')
  @UseGuards(JwtAuthGuard)
  async updateArticle(
    @Param('articleId') articleId: number,
    @Body() body,
  ): Promise<ArticleDetail> {
    return await this.articleService.updateArticle(articleId, body);
  }
}
