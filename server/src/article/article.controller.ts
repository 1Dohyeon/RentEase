import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { AddressEntity } from 'src/models/address.entity';
import { ArticleEntity, Currency } from 'src/models/article.entity';
import { CategoryEntity } from 'src/models/category.entity';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

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
  ) {
    const userId = req.user.id;
    console.log(userId);
    return await this.articleService.createArticle(
      userId,
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
  async getArticleById(
    @Param('articleId') articleId: number,
  ): Promise<ArticleEntity | undefined> {
    return this.articleService.getArticleById(articleId);
  }

  /**
   * 특정 article 삭제
   */
  @Delete(':articleId')
  @UseGuards(JwtAuthGuard)
  async deleteArticleById(
    @Param('articleId') articleId: number,
  ): Promise<ArticleEntity | undefined> {
    return this.articleService.deleteArticleById(articleId);
  }

  /**
   * 프로필 업데이트
   */
  @Patch('edit/:articleId')
  @UseGuards(JwtAuthGuard)
  async updateArticle(@Param('articleId') articleId: number, @Body() body) {
    return await this.articleService.updateArticle(articleId, body);
  }
}
