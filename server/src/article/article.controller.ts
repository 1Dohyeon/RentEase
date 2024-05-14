import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/')
  async getArticles() {
    return this.articleService.getArticles();
  }

  @Get('/:articleId')
  async getArticleById(articleId: number) {
    return this.articleService.getArticleById(articleId);
  }

  @Post('/write')
  @UseGuards(JwtAuthGuard)
  async createArticle() {
    return this.articleService.createArticle();
  }

  @Patch('/articleId')
  @UseGuards(JwtAuthGuard)
  async updateArticle(articleId: number) {
    return this.articleService.updateArticle(articleId);
  }

  @Delete('/articleId')
  @UseGuards(JwtAuthGuard)
  async deleteArticle(articleId: number) {
    return this.articleService.deleteArticle(articleId);
  }
}
