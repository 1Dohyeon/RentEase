import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Injectable()
export class ArticleRepository extends Repository<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repository: Repository<ArticleEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

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
