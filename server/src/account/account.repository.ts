import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccount, UserEntity } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AccountRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly userRepository: UserRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  /**
   * 계정 정보만 불러옴(email, username)
   */
  async getAccountById(userId: number): Promise<UserAccount> {
    const user = await this.userRepository.getUserById(userId);

    // 사용자 정보가 없으면 예외 처리
    if (!user) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * password 업데이트
   * to AccountService.updatePassword
   */
  async updatePassword(
    userId: number,
    hashedPassword: string,
  ): Promise<UserAccount> {
    const updatedUser = await this.userRepository.getUserById(userId);
    updatedUser.password = hashedPassword;
    await this.repository.save(updatedUser);

    return await this.getAccountById(userId);
  }

  /**
   * to settingController.deleteUser
   */
  async deleteUserById(userId: number) {
    const deletedUser = await this.userRepository.getUserById(userId);
    await this.repository.delete(userId);
    return {
      id: deletedUser.id,
      deletedAt: deletedUser.deletedAt,
    };
  }
}
