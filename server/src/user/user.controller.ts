import { Controller, Get, Param } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Controller('users')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * 특정 User 인스턴스 불러옴
   */
  @Get(':userId')
  async getUserById(
    @Param('userId') userId: number,
  ): Promise<UserEntity | undefined> {
    return this.userRepository.getReadOnlyUserDataById(userId);
  }
}
