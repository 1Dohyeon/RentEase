import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class AccountRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  /**
   * 사용자의 비밀번호를 업데이트
   * @param userAllInfo 업데이트할 사용자 정보
   * @param hashedPassword 해싱된 새로운 비밀번호
   * @returns 업데이트된 사용자 정보를 나타내는 객체
   */
  async updatePassword(
    userAllInfo: UserEntity,
    hashedPassword: string,
  ): Promise<UserEntity> {
    userAllInfo.password = hashedPassword;
    return await this.repository.save(userAllInfo);
  }

  /**
   * 사용자 계정을 소프트 삭제
   * @param userId 삭제할 사용자의 ID
   * @returns {Promise<UpdateResult>} 업데이트 작업의 결과를 나타내는 객체
   */
  async deleteUserById(userId: number): Promise<UpdateResult> {
    return await this.repository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where('id = :id', { id: userId })
      .execute();
  }
}
