import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserAccount } from 'src/models/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getAccountById(userId: number): Promise<UserAccount> {
    const user = await this.userRepository.getUserInfoById(userId);

    if (!user) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * password 해시화
   * to SettingController.updatePassword
   */
  async updatePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.getAccountById(userId);
    const userAllInfo = await this.userRepository.getUserByEmail(user.email);

    if (!userAllInfo) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }

    const checkOldPassword = await this.checkPassword(userAllInfo, oldPassword);

    if (!checkOldPassword) {
      throw new BadRequestException('기존 비밀번호를 잘못되었습니다.');
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.accountRepository.updatePassword(userAllInfo, hashedPassword);

      return await this.getAccountById(userId);
    } catch (error) {
      throw new BadRequestException('비밀번호 업데이트에 실패했습니다.');
    }
  }

  /**
   * password 체크
   */
  private async checkPassword(
    user: UserAccount,
    password: string,
  ): Promise<boolean> {
    const userAllInfo = await this.userRepository.getUserByEmail(user.email);
    return await bcrypt.compare(password, userAllInfo.password);
  }

  /** 계정 삭제 */
  async deleteUserById(userId: number): Promise<UserAccount> {
    const user = await this.getAccountById(userId);
    if (user) await this.accountRepository.deleteUserById(userId);
    return await this.getAccountById(userId);
  }
}
