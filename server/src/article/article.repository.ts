import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const articles = await this.repository
        .createQueryBuilder('article')
        .select([
          'article.id',
          'article.title',
          'article.dailyprice',
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
        .leftJoin('article.addresses', 'address')
        .leftJoin('article.categories', 'category')
        .leftJoin('article.author', 'author')
        .where('article.isDeleted = false')
        .getMany();

      return articles.map((article) => ({
        ...article,
        createdAt: timeSince(article.createdAt),
      }));
    } catch (err) {
      throw new BadRequestException('AR: 알 수 없는 에러가 발생하였습니다.');
    }
  }

  /**
   * 특정 카테고리에 속한 게시글 조회
   * @param categoryId 카테고리 ID
   */
  async getArticlesByCategory(
    categoryId: number,
  ): Promise<ArticleBanner[] | undefined> {
    try {
      const articles = await this.repository
        .createQueryBuilder('article')
        .select([
          'article.id',
          'article.title',
          'article.dailyprice',
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
        .leftJoin('article.addresses', 'address')
        .leftJoin('article.categories', 'category')
        .leftJoin('article.author', 'author')
        .where('category.id = :categoryId', { categoryId })
        .andWhere('article.isDeleted = false')
        .getMany();

      return articles.map((article) => ({
        ...article,
        createdAt: timeSince(article.createdAt),
      }));
    } catch (err) {
      throw new BadRequestException('AR: 알 수 없는 에러가 발생하였습니다.');
    }
  }

  /**
   * 사용자 주소 정보와 동일한 게시글만 조회
   * @param author 사용자 정보 (여기서는 UserEntity)
   * @param location 사용자 주소 정보를 반영할지 여부
   */
  async getArticlesByLocation(
    addressIds: number[],
  ): Promise<ArticleBanner[] | undefined> {
    try {
      // 사용자의 주소 정보에 맞는 게시글을 조회
      const articles = await this.repository
        .createQueryBuilder('article')
        .select([
          'article.id',
          'article.title',
          'article.dailyprice',
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
        .leftJoin('article.addresses', 'address')
        .leftJoin('article.categories', 'category')
        .leftJoin('article.author', 'author')
        .where('address.id IN (:...addressIds)', { addressIds })
        .andWhere('article.isDeleted = false')
        .getMany();

      return articles.map((article) => ({
        ...article,
        createdAt: timeSince(article.createdAt),
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
          'article.createdAt',
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
        createdAt: timeSince(article.createdAt),
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
        .andWhere('article.isDeleted = false')
        .select([
          'article.id',
          'article.title',
          'article.content',
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

      if (!article) throw new Error();

      // createdAt 필드가 Date 타입이라고 가정하고, 타입 캐스팅을 통해 변환
      return article;
    } catch (error) {
      throw new BadRequestException('AR: 해당하는 게시글을 찾을 수 없습니다.');
    }
  }

  /**
   * id를 통해 article detail(createdAt 포맷) 정보 불러옴
   */
  async getArticleDetailById(
    articleId: number,
  ): Promise<ArticleDetail | undefined> {
    try {
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

      if (!article) throw new Error();

      // createdAt 필드가 Date 타입이라고 가정하고, 타입 캐스팅을 통해 변환
      return {
        ...article,
        createdAt: timeSince(article.createdAt),
      };
    } catch (error) {
      throw new BadRequestException('AR: 해당하는 게시글을 찾을 수 없습니다.');
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

    await this.repository
      .createQueryBuilder()
      .update(ArticleEntity)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where('id = :id', { id: articleId })
      .execute();

    return article;
  }

  /**
   * article 업데이트
   */
  async updateArticle(
    articleId: number,
    updateStatus: Partial<ArticleEntity>,
  ): Promise<ArticleEntity> {
    await this.updateArticleInfo(articleId, updateStatus);
    await this.updateArticleCategory(articleId, updateStatus);
    await this.updateArticleAddress(articleId, updateStatus);

    const updatedArticle = await this.getArticleById(articleId);
    return updatedArticle;
  }

  async updateArticleInfo(
    articleId: number,
    updateStatus: Partial<ArticleEntity>,
  ): Promise<ArticleEntity> {
    try {
      // 변경할 필드와 값 준비
      const updateFields: { [key: string]: any } = {};

      if (updateStatus.title) updateFields.title = updateStatus.title;
      if (updateStatus.content) updateFields.content = updateStatus.content;
      if (updateStatus.dailyprice)
        updateFields.dailyprice = updateStatus.dailyprice;
      if (updateStatus.weeklyprice)
        updateFields.weeklyprice = updateStatus.weeklyprice;
      if (updateStatus.monthlyprice)
        updateFields.monthlyprice = updateStatus.monthlyprice;
      if (updateStatus.currency) updateFields.currency = updateStatus.currency;

      // 필드 업데이트 쿼리
      await this.repository
        .createQueryBuilder()
        .update(ArticleEntity)
        .set(updateFields)
        .where('id = :id', { id: articleId })
        .execute();

      const updatedArticle = await this.getArticleById(articleId);
      return updatedArticle;
    } catch {
      throw new NotFoundException('AR: 게시글 정보 업데이트에 실패하였습니다.');
    }
  }

  async updateArticleCategory(
    articleId: number,
    updateStatus: Partial<ArticleEntity>,
  ): Promise<ArticleEntity> {
    try {
      const article = await this.getArticleById(articleId);
      // categories 업데이트
      if (updateStatus.categories) {
        // 기존 관계 삭제
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

      const updatedArticle = await this.getArticleById(articleId);
      return updatedArticle;
    } catch {
      throw new NotFoundException('AR: 게시글 주소 업데이트에 실패하였습니다.');
    }
  }

  async updateArticleAddress(
    articleId: number,
    updateStatus: Partial<ArticleEntity>,
  ): Promise<ArticleEntity> {
    try {
      const article = await this.getArticleById(articleId);

      // addresses 업데이트
      if (updateStatus.addresses) {
        try {
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
        } catch (err) {
          throw new NotFoundException('AS: 주소 업데이트에 실패하였습니다.');
        }
      }

      const updatedArticle = await this.getArticleById(articleId);
      return updatedArticle;
    } catch {
      throw new NotFoundException('AS: 게시글 정보 업데이트에 실패하였습니다.');
    }
  }
}
