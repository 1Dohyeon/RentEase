import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { BookmarkRepository } from './bookmark.repository';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly userService: UserService,
    private readonly bookmarkRepository: BookmarkRepository,
  ) {}

  async createBookmark(userId: number) {
    // 사용자 존재 여부
    const user = await this.userService.getUserById(userId);

    const bookmark = await this.bookmarkRepository.createBookmark(userId);

    user.bookmark = bookmark;
    await this.userService.updateUser(user);

    return bookmark;
  }
}
