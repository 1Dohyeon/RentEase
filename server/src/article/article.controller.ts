import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { OptionalAuthGuard } from 'src/auth/jwt/jwt.optionalAuthGuard';
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
  @UseGuards(OptionalAuthGuard)
  async getAllArticles(@Request() req): Promise<ArticleBanner[]> {
    const userId = req.user ? req.user.id : null;
    return await this.articleService.getAllArticles(userId);
  }

  /**
   * 특정 카테고리에 속한 게시글 조회
   * @param categoryId 카테고리 ID
   * @returns 해당 카테고리에 속한 게시글의 배너 정보를 반환
   * 예: /articles/category?categoryId=1
   */
  @Get('category')
  @UseGuards(OptionalAuthGuard)
  async getArticlesByCategory(
    @Request() req,
    @Query('categoryId') categoryId: number,
  ): Promise<ArticleBanner[]> {
    const userId = req.user ? req.user.id : null;
    return await this.articleService.getArticlesByCategory(userId, categoryId);
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
   * @param file 업로드된 파일 (메인 이미지)
   * @returns 생성된 게시글 정보를 반환
   */
  @Post('write')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
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
   * @param file 업로드된 파일 (메인 이미지)
   * @returns 업데이트된 게시글 정보를 반환
   */
  @Patch('edit/:articleId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateArticle(
    @Param('articleId') articleId: number,
    @Body() body,
  ): Promise<ArticleDetail> {
    return await this.articleService.updateArticle(articleId, body);
  }

  @Patch(':articleId/main-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addMainImage(
    @Param('articleId') articleId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException(
        '프로필 이미지가 업로드되지 않았습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const mainImageUrl = file.path;
    return await this.articleService.addMainImage(articleId, mainImageUrl);
  }
  /**
   * 게시글 메인 이미지 삭제
   * @param articleId 게시글 ID
   * @returns 업데이트된 게시글 엔티티
   */
  @Delete(':articleId/main-image')
  @UseGuards(JwtAuthGuard)
  async deleteMainImage(@Param('articleId') articleId: number) {
    return await this.articleService.deleteMainImage(articleId);
  }
}
