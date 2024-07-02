import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  /**
   * password 업데이트
   */
  async updatePassword(userAllInfo: UserEntity, hashedPassword: string) {
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
