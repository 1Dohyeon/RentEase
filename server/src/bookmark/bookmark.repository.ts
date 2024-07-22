import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookmarkEntity } from 'src/models/bookmark.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookmarkRepository {
  constructor(
    @InjectRepository(BookmarkEntity)
    private readonly repository: Repository<BookmarkEntity>,
  ) {}

  async createBookmark(userId: number): Promise<BookmarkEntity> {
    const bookmark = this.repository.create({
      user: { id: userId },
    });
    return await this.repository.save(bookmark);
  }

  async getBookmarkByUserId(
    userId: number,
  ): Promise<BookmarkEntity | undefined> {
    const queryBuilder = this.repository
      .createQueryBuilder('bookmark')
      .leftJoinAndSelect('bookmark.user', 'user')
      .leftJoinAndSelect('bookmark.articles', 'article')
      .leftJoinAndSelect('article.addresses', 'address')
      .where('user.id = :userId', { userId })
      .andWhere('user.isDeleted = false')
      .andWhere('bookmark.isDeleted = false')
      .select([
        'bookmark.id',
        'user.id',
        'user.nickname',
        'article.id',
        'article.title',
        'article.dailyprice',
        'article.currency',
        'address.city',
        'address.district',
      ]);

    return queryBuilder.getOne();
  }

  async addArticleInBookmark(
    bookmarkid: number,
    articleId: number,
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .relation(BookmarkEntity, 'articles')
      .of(bookmarkid)
      .add(articleId);
  }

  async removeArticleInBookmark(
    bookmarkid: number,
    articleId: number,
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .relation(BookmarkEntity, 'articles')
      .of(bookmarkid)
      .remove(articleId);
  }
}
