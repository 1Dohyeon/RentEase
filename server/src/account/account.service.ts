import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  /**
   * 특정 사용자 계정 정보 조회
   * @param userId 사용자 ID
   * @returns 사용자의 기본 계정 정보
   * @throws BadRequestException 해당하는 사용자를 찾을 수 없을 경우 예외 발생
   */
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
   * 비밀번호 업데이트
   * @param userId 사용자 ID
   * @param oldPassword 기존 비밀번호
   * @param newPassword 새로운 비밀번호
   * @returns 업데이트된 사용자 계정 정보
   * @throws BadRequestException 해당하는 사용자를 찾을 수 없거나, 기존 비밀번호가 일치하지 않을 경우 예외 발생
   */
  async updatePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.getAccountById(userId);
    const userAllInfo = await this.userRepository.getUserByEmail(user.email);

    if (!userAllInfo) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    const checkOldPassword = await this.checkPassword(userAllInfo, oldPassword);

    if (!checkOldPassword) {
      throw new BadRequestException('기존 비밀번호를 잘못되었습니다.');
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await this.accountRepository.updatePassword(
        userAllInfo,
        hashedPassword,
      );

      if (!updatedUser) {
        throw new BadRequestException('비밀번호 업데이트에 실패했습니다.');
      }

      return await this.getAccountById(userId);
    } catch (error) {
      throw new BadRequestException('비밀번호 업데이트에 실패했습니다.');
    }
  }

  /**
   * 비밀번호 체크
   * @param user 사용자 계정 정보
   * @param password 비밀번호
   * @returns 비밀번호 일치 여부 (true/false)
   */
  private async checkPassword(
    user: UserAccount,
    password: string,
  ): Promise<boolean> {
    const userAllInfo = await this.userRepository.getUserByEmail(user.email);
    return await bcrypt.compare(password, userAllInfo.password);
  }

  /**
   * 사용자 계정 삭제 (soft delete)
   * @param userId 사용자 ID
   * @returns 삭제된 사용자 계정 정보
   */
  async deleteUserById(userId: number): Promise<UserAccount> {
    const user = await this.getAccountById(userId);
    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    const deletedUser = await this.accountRepository.deleteUserById(userId);

    if (!deletedUser) {
      throw new BadRequestException('계정 삭제에 실패하였습니다.');
    }

    return user;
  }
}
