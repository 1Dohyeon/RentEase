import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AccountRepository extends UserRepository {
  async getProfile(userId: number) {
    return this.getUserById(userId);
  }
}
