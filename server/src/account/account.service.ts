import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async updatePassword(userId: number, newPassword: string) {
    try {
      console.log(userId, newPassword);
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      return await this.accountRepository.updatePassword(
        userId,
        hashedPassword,
      );
    } catch (error) {
      throw new BadRequestException('비밀번호 업데이트에 실패했습니다.');
    }
  }
}
