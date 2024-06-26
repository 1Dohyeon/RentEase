import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserAccount, UserEntity } from 'src/models/user.entity';
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
   * 사용자 계정 정보 불러옴
   */
  async getAccountById(userId: number): Promise<UserAccount> {
    const user = await this.userRepository.getUserInfoById(userId);

    // 사용자 정보가 없으면 예외 처리
    if (!user) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      updatedAt: user.updatedAt,
      addresses: user.addresses,
    };
  }

  /**
   * password 체크
   */
  async checkPassword(userId, password): Promise<boolean> {
    const user = await this.getAccountById(userId);
    const userAllInfo = await this.userRepository.getUserByEmail(user.email);
    const check = await bcrypt.compare(password, userAllInfo.password);

    return check;
  }

  /**
   * password 업데이트
   */
  async updatePassword(
    userId: number,
    hashedPassword: string,
  ): Promise<UserAccount> {
    const user = await this.getAccountById(userId);
    const userAllInfo = await this.userRepository.getUserByEmail(user.email);
    userAllInfo.password = hashedPassword;
    await this.repository.save(userAllInfo);

    return await this.getAccountById(userId);
  }

  /**
   * 계정 삭제
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
