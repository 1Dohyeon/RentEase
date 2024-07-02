import { Controller, Get, Param } from '@nestjs/common';
import { UserEntity } from '../models/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 기본 정보 불러옴
   * #다른 사용자도 볼 수 있는 정보
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
   */
  @Get(':userId/articles')
  async getArticlesByUserId(
    @Param('userId') userId: number,
  ): Promise<UserEntity | undefined> {
    return await this.userService.getArticlesByUserId(userId);
  }
}
