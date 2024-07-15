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

  async createBookmark(userId: number) {
    const bookmark = this.repository.create({
      user: { id: userId },
    });
    return await this.repository.save(bookmark);
  }
}
