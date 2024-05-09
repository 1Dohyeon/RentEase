import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AccountRepository extends UserRepository {
  /**
   * 계정 정보만 불러옴(email, username)
   * to SettingController.getAccountById
   */
  async getAccountById(userId: number) {
    const user = await this.getUserById(userId);

    // 사용자 정보가 없으면 예외 처리
    if (!user) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return {
      email: user.email,
      username: user.username,
    };
  }
}
