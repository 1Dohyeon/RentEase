import { Injectable } from '@nestjs/common';
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
   * password 체크
   */
  async checkPassword(user: UserAccount, password: string): Promise<boolean> {
    const userAllInfo = await this.userRepository.getUserByEmail(user.email);
    return await bcrypt.compare(password, userAllInfo.password);
  }

  /**
   * password 업데이트
   */
  async updatePassword(user: UserAccount, hashedPassword: string) {
    const userAllInfo = await this.userRepository.getUserByEmail(user.email);
    userAllInfo.password = hashedPassword;
    await this.repository.save(userAllInfo);
  }

  /**
   * 계정 삭제
   */
  async deleteUserById(userId: number) {
    await this.repository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where('id = :id', { id: userId })
      .execute();
  }
}
