import { Controller, Get, Param } from '@nestjs/common';
import { BookmarkEntity } from 'src/models/bookmark.entity';
import { BookmarkService } from './bookmark.service';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get(':userId')
  async getBookmarkByUserId(
    @Param('userId') userId: number,
  ): Promise<BookmarkEntity | undefined> {
    return await this.bookmarkService.getBookmarkByUserId(userId);
  }
}
