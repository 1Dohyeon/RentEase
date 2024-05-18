import { BadRequestException, Injectable } from '@nestjs/common';
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
    return await this.repository.find();
  }

  async getArticleById(articleId: number) {
    try {
      const article = await this.repository
        .createQueryBuilder('article')
        .where('article.id = :id', { id: articleId })
        // password 제외하고 불러옴
        .select(['article.title', 'article.createAt'])
        .getOne();

      if (!article) throw new Error();
      return article;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }

  async createArticle() {
    return;
  }

  async updateArticle(articleId: number) {
    return;
  }

  async deleteArticle(articleId: number) {
    return;
  }
}
