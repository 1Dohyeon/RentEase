import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from 'src/models/address.entity';
import { ArticleEntity, Currency } from 'src/models/article.entity';
import { CategoryEntity } from 'src/models/category.entity';
import { UserEntity } from 'src/models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleRepository extends Repository<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repository: Repository<ArticleEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  /**
   * article 생성
   */
  async createArticle(
    title: string,
    content: string,
    dailyprice: number,
    currency: Currency,
    addresses: AddressEntity[],
    author: UserEntity,
    categories: CategoryEntity[],
    weeklyprice?: number,
    monthlyprice?: number,
  ): Promise<ArticleEntity> {
    const article = this.repository.create({
      title,
      content,
      dailyprice,
      currency,
      addresses,
      author,
      categories,
      weeklyprice,
      monthlyprice,
    });
    await this.repository.save(article);

    return this.getArticleById(article.id);
  }

  /**
   * id를 통해 article 상세 정보 불러옴
   */
  async getArticleById(articleId: number): Promise<ArticleEntity | undefined> {
    try {
      const article = await this.repository
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.addresses', 'address')
        .leftJoinAndSelect('article.categories', 'category')
        .leftJoinAndSelect('article.author', 'author')
        .where('article.id = :id', { id: articleId })
        .select([
          'article.id',
          'article.title',
          'article.content',
          'article.dailyprice',
          'article.weeklyprice',
          'article.monthlyprice',
          'article.currency',
          'address.city',
          'address.district',
          'category.id',
          'category.title',
          'author.id',
          'author.nickname',
        ])
        .getOne();

      if (!article) throw new Error();
      return article;
    } catch (error) {
      throw new BadRequestException('해당하는 게시글을 찾을 수 없습니다.');
    }
  }

  async deleteArticleById(
    articleId: number,
  ): Promise<ArticleEntity | undefined> {
    const article = await this.getArticleById(articleId);

    // 게시글이 존재하지 않으면 예외를 던집니다.
    if (!article) {
      throw new NotFoundException('해당하는 게시글을 찾을 수 없습니다.');
    }

    // 게시글을 삭제합니다.
    await this.repository.remove(article);

    return article;
  }
}
