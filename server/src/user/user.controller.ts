import { Controller, Get, Param } from '@nestjs/common';
import { UserEntity } from '../models/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * user 정보 불러옴
   */
  @Get(':userId')
  async getUserById(
    @Param('userId') userId: number,
  ): Promise<UserEntity | undefined> {
    return this.userService.getUserById(userId);
  }

  /**
   * user의 게시글들 불러옴
   */
  @Get(':userId')
  async getArticlesByUserId(
    @Param('userId') userId: number,
  ): Promise<UserEntity | undefined> {
    return this.userService.getArticlesByUserId(userId);
  }

  /**
   * user가 review를 남긴 게시글들 불러옴
   */
  @Get(':userId')
  async getReviewsByUserId(
    @Param('userId') userId: number,
  ): Promise<UserEntity | undefined> {
    return this.userService.getUserById(userId);
  }
}
