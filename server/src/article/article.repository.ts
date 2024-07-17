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
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repository: Repository<ArticleEntity>,
  ) {}

  /**
   * 모든 게시글 조회
   * @returns 모든 게시글의 배너 정보를 반환
   */
  async getAllArticles(): Promise<ArticleBanner[]> {
    const articles = await this.repository
      .createQueryBuilder('article')
      .select([
        'article.id',
        'article.title',
        'article.dailyprice',
        'article.currency',
        'article.createdAt',
        'article.createdTimeSince',
        'article.avgnumofstars',
        'address.id',
        'address.city',
        'address.district',
        'category.id',
        'category.title',
        'author.id',
        'author.nickname',
        'review.numofstars',
      ])
      .leftJoin('article.addresses', 'address')
      .leftJoin('article.categories', 'category')
      .leftJoin('article.author', 'author')
      .leftJoin('article.reviews', 'review')
      .where('article.isDeleted = false')
      .andWhere('author.isDeleted = false')
      .orderBy('article.avgnumofstars', 'DESC') // avgnumofstars를 큰 순서대로 정렬
      .addOrderBy('article.createdAt', 'DESC') // createdAt을 최신순으로 정렬
      .getMany();

    return articles.map((article) => ({
      ...article,
      createdTimeSince: timeSince(article.createdTimeSince),
    }));
  }

  /**
   * 특정 카테고리에 속한 게시글 조회
   * @param categoryId 카테고리 ID
   * @returns 해당 카테고리에 속한 게시글의 배너 정보를 반환
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
        'article.avgnumofstars',
        'address.id',
        'address.city',
        'address.district',
        'category.id',
        'category.title',
        'author.id',
        'author.nickname',
        'review.numofstars',
      ])
      .leftJoin('article.addresses', 'address')
      .leftJoin('article.categories', 'category')
      .leftJoin('article.author', 'author')
      .leftJoin('article.reviews', 'review')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('article.isDeleted = false')
      .andWhere('author.isDeleted = false')
      .orderBy('article.avgnumofstars', 'DESC') // avgnumofstars를 큰 순서대로 정렬
      .addOrderBy('article.createdAt', 'DESC') // createdAt을 최신순으로 정렬
      .getMany();

    return articles.map((article) => ({
      ...article,
      createdTimeSince: timeSince(article.createdTimeSince),
    }));
  }

  /**
   * 사용자 주소 정보와 동일한 게시글만 조회
   * @param addressIds 사용자 주소 ID 배열
   * @returns 사용자 주소 정보와 동일한 게시글의 배너 정보를 반환
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
        'article.avgnumofstars',
        'address.id',
        'address.city',
        'address.district',
        'category.id',
        'category.title',
        'author.id',
        'author.nickname',
        'review.numofstars',
      ])
      .leftJoin('article.addresses', 'address')
      .leftJoin('article.categories', 'category')
      .leftJoin('article.author', 'author')
      .leftJoin('article.reviews', 'review')
      .where('address.id IN (:...addressIds)', { addressIds })
      .andWhere('article.isDeleted = false')
      .andWhere('author.isDeleted = false')
      .orderBy('article.avgnumofstars', 'DESC') // avgnumofstars를 큰 순서대로 정렬
      .addOrderBy('article.createdAt', 'DESC') // createdAt을 최신순으로 정렬
      .getMany();

    return articles.map((article) => ({
      ...article,
      createdTimeSince: timeSince(article.createdTimeSince),
    }));
  }

  /**
   * 사용자 주소 정보와 일치하지 않는 게시글만 조회
   * @param addressIds 사용자 주소 ID 배열
   * @returns 사용자 주소 정보와 일치하지 않는 게시글의 배너 정보를 반환
   */
  async getArticlesNotByLocation(
    addressIds: number[],
  ): Promise<ArticleBanner[]> {
    const articles = await this.repository
      .createQueryBuilder('article')
      .select([
        'article.id',
        'article.title',
        'article.dailyprice',
        'article.currency',
        'article.createdTimeSince',
        'article.avgnumofstars',
        'address.id',
        'address.city',
        'address.district',
        'category.id',
        'category.title',
        'author.id',
        'author.nickname',
        'review.numofstars',
      ])
      .leftJoin('article.addresses', 'address')
      .leftJoin('article.categories', 'category')
      .leftJoin('article.author', 'author')
      .leftJoin('article.reviews', 'review')
      .where('address.id NOT IN (:...addressIds)', { addressIds })
      .andWhere('article.isDeleted = false')
      .andWhere('author.isDeleted = false')
      .orderBy('article.avgnumofstars', 'DESC') // avgnumofstars를 큰 순서대로 정렬
      .addOrderBy('article.createdAt', 'DESC') // createdAt을 최신순으로 정렬
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
   * @returns 해당 카테고리와 사용자 주소 정보와 일치하는 게시글의 배너 정보를 반환
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
          'article.avgnumofstars',
          'address.id',
          'address.city',
          'address.district',
          'category.id',
          'category.title',
          'author.id',
          'author.nickname',
          'review.numofstars',
        ])
        .leftJoin('article.addresses', 'address')
        .leftJoin('article.categories', 'category')
        .leftJoin('article.author', 'author')
        .leftJoin('article.reviews', 'review')
        .where('category.id = :categoryId', { categoryId })
        .andWhere('address.id IN (:...addressIds)', { addressIds })
        .andWhere('article.isDeleted = false')
        .andWhere('author.isDeleted = false')
        .orderBy('article.avgnumofstars', 'DESC') // avgnumofstars를 큰 순서대로 정렬
        .addOrderBy('article.createdAt', 'DESC') // createdAt을 최신순으로 정렬
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
   * 특정 카테고리에서 사용자 주소 정보와 일치하지 않는 게시글 조회
   * @param categoryId 카테고리 ID
   * @param addressIds 사용자의 주소 ID 배열
   * @returns 해당 카테고리와 사용자 주소 정보와 일치하는 게시글의 배너 정보를 반환
   */
  async getArticlesByCategoryAndNotLocation(
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
          'article.avgnumofstars',
          'address.id',
          'address.city',
          'address.district',
          'category.id',
          'category.title',
          'author.id',
          'author.nickname',
          'review.numofstars',
        ])
        .leftJoin('article.addresses', 'address')
        .leftJoin('article.categories', 'category')
        .leftJoin('article.author', 'author')
        .leftJoin('article.reviews', 'review')
        .where('category.id = :categoryId', { categoryId })
        .andWhere('address.id NOT IN (:...addressIds)', { addressIds })
        .andWhere('article.isDeleted = false')
        .andWhere('author.isDeleted = false')
        .orderBy('article.avgnumofstars', 'DESC') // avgnumofstars를 큰 순서대로 정렬
        .addOrderBy('article.createdAt', 'DESC') // createdAt을 최신순으로 정렬
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
   * 작성자 ID로 게시글 조회
   * @param authorId 작성자 ID
   * @returns 해당 작성자가 작성한 게시글의 배너 정보를 반환
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
          'article.avgnumofstars',
          'address.id',
          'address.city',
          'address.district',
          'category.id',
          'category.title',
          'author.id',
          'author.nickname',
          'review.numofstars',
        ])
        .leftJoin('article.addresses', 'address')
        .leftJoin('article.categories', 'category')
        .leftJoin('article.author', 'author')
        .leftJoin('article.reviews', 'review')
        .where('author.id = :authorId', { authorId })
        .andWhere('article.isDeleted = false')
        .andWhere('author.isDeleted = false')
        .orderBy('article.avgnumofstars', 'DESC') // avgnumofstars를 큰 순서대로 정렬
        .addOrderBy('article.createdAt', 'DESC') // createdAt을 최신순으로 정렬
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
   * @param title 게시글 제목
   * @param content 게시글 내용
   * @param dailyprice 일일 가격
   * @param currency 통화
   * @param addresses 게시글에 연결할 주소
   * @param author 게시글 작성자
   * @param categories 게시글에 연결할 카테고리
   * @param weeklyprice 주간 가격 (선택 사항)
   * @param monthlyprice 월간 가격 (선택 사항)
   * @returns 생성된 게시글 정보를 반환
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
    return await this.repository.save(article);
  }

  /**
   * id를 통해 article 상세 정보 불러옴
   * @param articleId 게시글 ID
   * @returns 해당 게시글의 content를 제외한 상세 정보를 반환
   */
  async getArticleById(articleId: number): Promise<ArticleEntity | undefined> {
    const article = await this.repository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.addresses', 'address')
      .leftJoinAndSelect('article.categories', 'category')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.id = :id', { id: articleId })
      .andWhere('article.isDeleted = false')
      .andWhere('author.isDeleted = false')
      .select([
        'article.id',
        'article.title',
        'article.dailyprice',
        'article.weeklyprice',
        'article.monthlyprice',
        'article.currency',
        'article.createdAt',
        'article.avgnumofstars',
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
   * @param articleId 게시글 ID
   * @returns 해당 게시글의 상세 정보를 반환
   */
  async getArticleDetailById(
    articleId: number,
  ): Promise<ArticleDetail | undefined> {
    const article = await this.repository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.addresses', 'address')
      .leftJoinAndSelect('article.categories', 'category')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.reviews', 'review')
      .leftJoinAndSelect('review.writer', 'writer')
      .where('article.id = :id', { id: articleId })
      .andWhere('article.isDeleted = false')
      .andWhere('author.isDeleted = false')
      .select([
        'article.id',
        'article.title',
        'article.content',
        'article.dailyprice',
        'article.weeklyprice',
        'article.monthlyprice',
        'article.currency',
        'article.createdTimeSince',
        'article.avgnumofstars',
        'article.mainImage',
        'address.id',
        'address.city',
        'address.district',
        'category.id',
        'category.title',
        'author.id',
        'author.nickname',
        'review.id',
        'review.content',
        'review.numofstars',
        'writer.id',
        'writer.nickname',
      ])
      .getOne();

    return {
      ...article,
      createdTimeSince: timeSince(article.createdTimeSince),
    };
  }

  /**
   * id를 통해 게시글 삭제 (soft delete)
   * @param articleId 게시글 ID
   */
  async deleteArticleById(articleId: number) {
    await this.repository
      .createQueryBuilder()
      .update(ArticleEntity)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where('id = :id', { id: articleId })
      .execute();
  }

  /**
   * 게시글 정보 업데이트
   * @param articleId 게시글 ID
   * @param updateFields 업데이트할 필드
   */
  async updateArticleInfo(articleId: number, updateFields: object) {
    await this.repository
      .createQueryBuilder()
      .update(ArticleEntity)
      .set(updateFields)
      .where('id = :id', { id: articleId })
      .execute();
  }

  /**
   * 게시글 카테고리 업데이트
   * @param article 게시글 엔티티
   * @param categories 업데이트할 카테고리
   */
  async updateArticleCategory(
    article: ArticleEntity,
    categories: CategoryEntity[],
  ) {
    await this.repository
      .createQueryBuilder()
      .relation(ArticleEntity, 'categories')
      .of(article)
      .remove(article.categories);

    await this.repository
      .createQueryBuilder()
      .relation(ArticleEntity, 'categories')
      .of(article)
      .add(categories);
  }

  /**
   * 게시글 주소 업데이트
   * @param article 게시글 엔티티
   * @param updateStatus 업데이트할 주소
   */
  async updateArticleAddress(
    article: ArticleEntity,
    addresses: AddressEntity[],
  ) {
    await this.repository
      .createQueryBuilder()
      .relation(ArticleEntity, 'addresses')
      .of(article)
      .remove(article.addresses);

    await this.repository
      .createQueryBuilder()
      .relation(ArticleEntity, 'addresses')
      .of(article)
      .add(addresses);
  }

  /**
   * 게시글 별점 평균 newAvg로 업데이트
   * @param articleId 게시글 ID
   * @param newAvg 평균 별점
   */
  async updateArticleAvgStars(articleId: number, newAvg: number) {
    return await this.repository
      .createQueryBuilder('article')
      .update(ArticleEntity)
      .set({ avgnumofstars: newAvg })
      .where('id = :id', { id: articleId })
      .execute();
  }

  async updateMainImage(
    articleId: number,
    mainImageUrl: string,
  ): Promise<UpdateResult> {
    return await this.repository
      .createQueryBuilder()
      .update(ArticleEntity)
      .set({ mainImage: mainImageUrl })
      .where('id = :id', { id: articleId })
      .execute();
  }

  /**
   * 게시글 메인 이미지 삭제
   * @param article 게시글
   * @returns 업데이트된 게시글 엔티티
   */
  async deleteMainImage(article: ArticleEntity): Promise<UpdateResult> {
    return await this.repository
      .createQueryBuilder()
      .update(ArticleEntity)
      .set({ mainImage: null })
      .where('id = :id', { id: article.id })
      .execute();
  }
}
