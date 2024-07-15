import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
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

  @Patch(':userId/add/:articleId')
  @UseGuards(JwtAuthGuard)
  async addArticleInBookmark(
    @Param('userId') userId: number,
    @Param('articleId') articleId: number,
  ): Promise<void> {
    return await this.bookmarkService.addArticleInBookmark(userId, articleId);
  }

  @Patch(':userId/remove/:articleId')
  @UseGuards(JwtAuthGuard)
  async removeArticleInBookmark(
    @Param('userId') userId: number,
    @Param('articleId') articleId: number,
  ): Promise<void> {
    return await this.bookmarkService.removeArticleInBookmark(
      userId,
      articleId,
    );
  }
}
