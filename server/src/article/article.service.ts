import { Injectable } from '@nestjs/common';
import { ArticleRepository } from './article.repository';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async getArticles() {
    return this.articleRepository.getArticles();
  }

  async getArticleById(articleId: number) {
    return this.articleRepository.getArticleById(articleId);
  }

  async createArticle() {
    return this.articleRepository.createArticle();
  }

  async updateArticle(articleId: number) {
    return this.articleRepository.updateArticle(articleId);
  }

  async deleteArticle(articleId: number) {
    return this.articleRepository.deleteArticle(articleId);
  }
}
