import { BadRequestException, Injectable } from '@nestjs/common';
import { BookmarkEntity } from 'src/models/bookmark.entity';
import { UserService } from 'src/user/user.service';
import { BookmarkRepository } from './bookmark.repository';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly userService: UserService,
    private readonly bookmarkRepository: BookmarkRepository,
  ) {}

  // async onModuleInit() {
  //   await this.createBookmarksForExistingUsers();
  // }

  // // 기존 사용자 북마크 생성
  // async createBookmarksForExistingUsers() {
  //   const users = await this.userService.getAllUsers();
  //   for (const user of users) {
  //     if (!user.bookmark) {
  //       await this.createBookmark(user.id);
  //     }
  //   }
  // }

  // 북마크는 기본적으로 회원가입 시에 생성됨
  async createBookmark(userId: number): Promise<BookmarkEntity> {
    // 사용자 존재 여부
    const user = await this.userService.getUserById(userId);

    if (user.bookmark) {
      throw new BadRequestException('이미 북마크가 존재합니다.');
    }

    const bookmark = await this.bookmarkRepository.createBookmark(userId);

    user.bookmark = bookmark;
    await this.userService.updateUser(user);

    return bookmark;
  }

  async getBookmarkByUserId(
    userId: number,
  ): Promise<BookmarkEntity | undefined> {
    return await this.bookmarkRepository.getBookmarkByUserId(userId);
  }
}
