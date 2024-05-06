import { Controller, Get, Param } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Controller('users')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * user 정보 불러옴
   */
  @Get(':userId')
  async getUserById(
    @Param('userId') userId: number,
  ): Promise<UserEntity | undefined> {
    return this.userRepository.getUserById(userId);
  }

  /**
   * user의 게시글들 불러옴
   */
  @Get(':userId')
  async getArticlesByUserId(
    @Param('userId') userId: number,
  ): Promise<UserEntity | undefined> {
    return this.userRepository.getArticlesByUserId(userId);
  }

  /**
   * user가 review를 남긴 게시글들 불러옴
   */
  @Get(':userId')
  async getReviewsByUserId(
    @Param('userId') userId: number,
  ): Promise<UserEntity | undefined> {
    return this.userRepository.getUserById(userId);
  }
}
