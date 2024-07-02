import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timeSince } from 'src/helper/timeSince';
import { AddressEntity } from 'src/models/address.entity';
import {
  ArticleBanner,
  ArticleDetail,
  ArticleEntity,
  Currency,
} from 'src/models/article.entity';
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

  async getAllArticles(): Promise<ArticleBanner[]> {
    const articles = await this.repository
      .createQueryBuilder('article')
      .select([
        'article.id',
        'article.title',
        'article.dailyprice',
        'article.currency',
        'article.createdTimeSince',
        'address.id',
        'address.city',
        'address.district',
        'category.id',
        'category.title',
        'author.id',
        'author.nickname',
      ])
      .leftJoin('article.addresses', 'address')
      .leftJoin('article.categories', 'category')
      .leftJoin('article.author', 'author')
      .where('article.isDeleted = false')
      .getMany();

    return articles.map((article) => ({
      ...article,
      createdTimeSince: timeSince(article.createdTimeSince),
    }));
  }

  /**
   * 특정 카테고리에 속한 게시글 조회
   * @param categoryId 카테고리 ID
   */
  async getArticlesByCategory(
    categoryId: number,
  ): Promise<ArticleBanner[] | undefined> {
    const articles = await this.repository
      .createQueryBuilder('article')
      .select([
        'article.id',
        'article.title',
        'article.dailyprice',
        'article.currency',
        'article.createdTimeSince',
        'address.id',
        'address.city',
        'address.district',
        'category.id',
        'category.title',
        'author.id',
        'author.nickname',
      ])
      .leftJoin('article.addresses', 'address')
      .leftJoin('article.categories', 'category')
      .leftJoin('article.author', 'author')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('article.isDeleted = false')
      .getMany();

    return articles.map((article) => ({
      ...article,
      createdTimeSince: timeSince(article.createdTimeSince),
    }));
  }

  /**
   * 사용자 주소 정보와 동일한 게시글만 조회
   * @param author 사용자 정보 (여기서는 UserEntity)
   * @param location 사용자 주소 정보를 반영할지 여부
   */
  async getArticlesByLocation(
    addressIds: number[],
  ): Promise<ArticleBanner[] | undefined> {
    const articles = await this.repository
      .createQueryBuilder('article')
      .select([
        'article.id',
        'article.title',
        'article.dailyprice',
        'article.currency',
        'article.createdTimeSince',
        'address.id',
        'address.city',
        'address.district',
        'category.id',
        'category.title',
        'author.id',
        'author.nickname',
      ])
      .leftJoin('article.addresses', 'address')
      .leftJoin('article.categories', 'category')
      .leftJoin('article.author', 'author')
      .where('address.id IN (:...addressIds)', { addressIds })
      .andWhere('article.isDeleted = false')
      .getMany();

    return articles.map((article) => ({
      ...article,
      createdTimeSince: timeSince(article.createdTimeSince),
    }));
  }

  /**
   * 특정 카테고리에서 사용자 주소 정보와 동일한 게시글 조회
   * @param categoryId 카테고리 ID
   * @param addressIds 사용자의 주소 ID 배열
   */
  async getArticlesByCategoryAndLocation(
    categoryId: number,
    addressIds: number[],
  ): Promise<ArticleBanner[] | undefined> {
    try {
      const articles = await this.repository
        .createQueryBuilder('article')
        .select([
          'article.id',
          'article.title',
          'article.dailyprice',
          'article.currency',
          'article.createdTimeSince',
          'address.id',
          'address.city',
          'address.district',
          'category.id',
          'category.title',
          'author.id',
          'author.nickname',
        ])
        .leftJoin('article.addresses', 'address')
        .leftJoin('article.categories', 'category')
        .leftJoin('article.author', 'author')
        .where('category.id = :categoryId', { categoryId })
        .andWhere('address.id IN (:...addressIds)', { addressIds })
        .andWhere('article.isDeleted = false')
        .getMany();

      return articles.map((article) => ({
        ...article,
        createdTimeSince: timeSince(article.createdTimeSince),
      }));
    } catch (err) {
      throw new BadRequestException('AR: 알 수 없는 에러가 발생하였습니다.');
    }
  }

  /**
   * 특정 카테고리에서 사용자 주소 정보와 동일한 게시글 조회
   * @param categoryId 카테고리 ID
   * @param addressIds 사용자의 주소 ID 배열
   */
  async getArticlesByAuthorId(
    authorId: number,
  ): Promise<ArticleBanner[] | undefined> {
    try {
      const articles = await this.repository
        .createQueryBuilder('article')
        .select([
          'article.id',
          'article.title',
          'article.dailyprice',
          'article.currency',
          'article.createdTimeSince',
          'address.id',
          'address.city',
          'address.district',
          'category.id',
          'category.title',
          'author.id',
          'author.nickname',
        ])
        .leftJoin('article.addresses', 'address')
        .leftJoin('article.categories', 'category')
        .leftJoin('article.author', 'author')
        .where('author.id = :authorId', { authorId })
        .andWhere('article.isDeleted = false')
        .getMany();

      return articles.map((article) => ({
        ...article,
        createdTimeSince: timeSince(article.createdTimeSince),
      }));
    } catch (err) {
      throw new BadRequestException('AR: 알 수 없는 에러가 발생하였습니다.');
    }
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
  ) {
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
    return await this.repository.save(article);
  }

  /**
   * id를 통해 article 상세 정보 불러옴
   */
  async getArticleById(articleId: number): Promise<ArticleEntity | undefined> {
    const article = await this.repository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.addresses', 'address')
      .leftJoinAndSelect('article.categories', 'category')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.id = :id', { id: articleId })
      .andWhere('article.isDeleted = false')
      .select([
        'article.id',
        'article.title',
        'article.dailyprice',
        'article.weeklyprice',
        'article.monthlyprice',
        'article.currency',
        'article.createdAt',
        'address.id',
        'address.city',
        'address.district',
        'category.id',
        'category.title',
        'author.id',
        'author.nickname',
      ])
      .getOne();

    return article;
  }

  /**
   * id를 통해 article detail(createdAt 포맷) 정보 불러옴
   */
  async getArticleDetailById(
    articleId: number,
  ): Promise<ArticleDetail | undefined> {
    const article = await this.repository
      .createQueryBuilder('article')
      // leftJoinAndSelect으로 가져온경우는 select를 마지막에 써서 데이터를 걸러내야함
      // 위 getAllArticles의 leftJoin으로 가져온경우는 select를 마지막에 안써도 됨
      .leftJoinAndSelect('article.addresses', 'address')
      .leftJoinAndSelect('article.categories', 'category')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.id = :id', { id: articleId })
      .andWhere('article.isDeleted = false')
      .select([
        'article.id',
        'article.title',
        'article.content',
        'article.dailyprice',
        'article.weeklyprice',
        'article.monthlyprice',
        'article.currency',
        'article.createdTimeSince',
        'address.id',
        'address.city',
        'address.district',
        'category.id',
        'category.title',
        'author.id',
        'author.nickname',
      ])
      .getOne();

    return {
      ...article,
      createdTimeSince: timeSince(article.createdTimeSince),
    };
  }

  async deleteArticleById(articleId: number) {
    await this.repository
      .createQueryBuilder()
      .update(ArticleEntity)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where('id = :id', { id: articleId })
      .execute();
  }

  async updateArticleInfo(articleId: number, updateFields: object) {
    // 필드 업데이트 쿼리
    await this.repository
      .createQueryBuilder()
      .update(ArticleEntity)
      .set(updateFields)
      .where('id = :id', { id: articleId })
      .execute();
  }

  async updateArticleCategory(
    article: ArticleEntity,
    updateStatus: Partial<ArticleEntity>,
  ) {
    await this.repository
      .createQueryBuilder()
      .relation(ArticleEntity, 'categories')
      .of(article)
      .remove(article.categories);

    // 새로운 관계 추가
    await this.repository
      .createQueryBuilder()
      .relation(ArticleEntity, 'categories')
      .of(article)
      .add(updateStatus.categories);
  }

  async updateArticleAddress(
    article: ArticleEntity,
    updateStatus: Partial<ArticleEntity>,
  ) {
    // 기존 관계 삭제
    await this.repository
      .createQueryBuilder()
      .relation(ArticleEntity, 'addresses')
      .of(article)
      .remove(article.addresses);

    // 새로운 관계 추가
    await this.repository
      .createQueryBuilder()
      .relation(ArticleEntity, 'addresses')
      .of(article)
      .add(updateStatus.addresses);
  }
}
