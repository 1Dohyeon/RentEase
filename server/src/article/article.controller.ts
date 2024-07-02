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
   * @returns 모든 게시글의 배너 정보를 반환
   */
  @Get()
  async getAllArticles(): Promise<ArticleBanner[]> {
    return await this.articleService.getAllArticles();
  }

  /**
   * 특정 카테고리에 속한 게시글 조회
   * @param categoryId 카테고리 ID
   * @returns 해당 카테고리에 속한 게시글의 배너 정보를 반환
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
   * @param req 요청 객체, JWT 토큰을 통해 사용자 정보를 확인
   * @param isLocation 사용자 위치 정보를 반영할지 여부
   * @returns 사용자 주소 정보와 동일한 게시글의 배너 정보를 반환
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
   * @param categoryId 카테고리 ID
   * @param req 요청 객체, JWT 토큰을 통해 사용자 정보를 확인
   * @param isLocation 사용자 위치 정보를 반영할지 여부
   * @returns 해당 카테고리와 사용자 주소 정보와 일치하는 게시글의 배너 정보를 반환
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
   * @param req 요청 객체, JWT 토큰을 통해 사용자 정보를 확인
   * @param title 게시글 제목
   * @param content 게시글 내용
   * @param dailyprice 일일 가격
   * @param currency 통화
   * @param addresses 게시글에 연결할 주소
   * @param categories 게시글에 연결할 카테고리
   * @param weeklyprice 주간 가격 (선택 사항)
   * @param monthlyprice 월간 가격 (선택 사항)
   * @returns 생성된 게시글 정보를 반환
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
   * article 상세 정보 불러옴
   * @param articleId 게시글 ID
   * @returns 해당 게시글의 상세 정보를 반환
   */
  @Get(':articleId')
  async getArticleDetailById(
    @Param('articleId') articleId: number,
  ): Promise<ArticleDetail | undefined> {
    return await this.articleService.getArticleDetailById(articleId);
  }

  /**
   * 특정 article 삭제 (소프트 삭제)
   * @param articleId 게시글 ID
   * @returns 삭제된 게시글 정보를 반환
   */
  @Patch('delete/:articleId')
  @UseGuards(JwtAuthGuard)
  async deleteArticleById(
    @Param('articleId') articleId: number,
  ): Promise<ArticleEntity | undefined> {
    return await this.articleService.deleteArticleById(articleId);
  }

  /**
   * article 업데이트
   * @param articleId 게시글 ID
   * @param body 업데이트할 게시글 정보
   * @returns 업데이트된 게시글 정보를 반환
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
