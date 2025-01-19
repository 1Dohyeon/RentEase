import { Controller, Get, Param } from '@nestjs/common';
import { UserEntity } from '../models/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 기본 정보 불러옴
   * #다른 사용자도 볼 수 있는 정보
   * @param userId 사용자 ID
   * @returns 해당 사용자의 기본 정보를 반환
   */
  @Get(':userId')
  async getUserById(
    @Param('userId') userId: number,
  ): Promise<UserEntity | undefined> {
    return await this.userService.getUserById(userId);
  }

  /**
   * 사용자 기본 정보와 사용자가 작성한 게시글들 불러옴
   * #다른 사용자도 볼 수 있는 정보
   * @param userId 사용자 ID
   * @returns 해당 사용자의 기본 정보와 작성한 게시글들을 반환
   */
  @Get(':userId/articles')
  async getArticlesByUserId(
    @Param('userId') userId: number,
  ): Promise<UserEntity | undefined> {
    return await this.userService.getArticlesByUserId(userId);
  }

  /**
   * 사용자 기본 정보와 사용자가 작성한 게시글들 불러옴
   * #다른 사용자도 볼 수 있는 정보
   * @param userId 사용자 ID
   * @returns 해당 사용자의 기본 정보와 작성한 게시글들을 반환
   */
  @Get(':userId/articlesAll')
  async getArticlesAllByUserId(
    @Param('userId') userId: number,
  ): Promise<UserEntity | undefined> {
    return await this.userService.getArticlesAllByUserId(userId);
  }

  /**
   * 사용자 기본 정보와 사용자가 작성한 리뷰들 불러옴
   * #다른 사용자도 볼 수 있는 정보
   * @param userId 사용자 ID
   * @returns 해당 사용자의 기본 정보와 작성한 리뷰들을 반환
   */
  @Get(':userId/reviews')
  async getReviewsByUserId(
    @Param('userId') userId: number,
  ): Promise<UserEntity | undefined> {
    return await this.userService.getReviewsByUserId(userId);
  }

  /**
   * 사용자 기본 정보와 사용자가 작성한 리뷰들 불러옴
   * #다른 사용자도 볼 수 있는 정보
   * @param userId 사용자 ID
   * @returns 해당 사용자의 기본 정보와 작성한 리뷰들을 반환
   */
  @Get(':userId/bookmarks')
  async getBookmarksByUserId(
    @Param('userId') userId: number,
  ): Promise<UserEntity | undefined> {
    return await this.userService.getBookmarksByUserId(userId);
  }
}
