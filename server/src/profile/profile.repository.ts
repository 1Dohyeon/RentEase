import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserProfile } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly userService: UserService,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  /**
   * 프로필 정보만 불러옴(nickname, username)
   * to SettingController.getProfileById
   */
  async getProfileById(userId: number): Promise<UserProfile> {
    const user = await this.userService.getUserById(userId);

    // 사용자 정보가 없으면 예외 처리
    if (!user) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return {
      id: user.id,
      nickname: user.nickname,
      username: user.username,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * profile 업데이트
   * to SettingAccount.updateProfile
   */
  async updateProfile(
    userId: number,
    updateStatus: Partial<UserEntity>,
  ): Promise<UserProfile> {
    const user = await this.userService.getUserById(userId);

    // 사용자가 변경한 값만 업데이트
    // Object.assign(user, updateStatus); // 이렇게 해도 아래랑 같은 결과
    if (updateStatus.username) {
      user.username = updateStatus.username;
    }
    if (updateStatus.nickname) {
      user.nickname = updateStatus.nickname;
    }
    await this.repository.save(user);

    return await this.getProfileById(userId);
  }
}
