import { Injectable } from '@nestjs/common';
import { UserRegisterDto } from './dtos/user.register.req';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    return await this.userRepository.createUser(userRegisterDto);
  }

  async getUserById(userId: number): Promise<UserEntity | undefined> {
    return await this.userRepository.getUserById(userId);
  }

  async getUserBySubForValidate(sub: string): Promise<UserEntity | undefined> {
    return await this.userRepository.getUserBySubForValidate(sub);
  }

  async getUserByEmail(email: string): Promise<any | null> {
    return await this.userRepository.getUserByEmail(email);
  }

  async getArticlesByUserId(userId: number): Promise<UserEntity | undefined> {
    return await this.userRepository.getArticlesByUserId(userId);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return await this.userRepository.existsByEmail(email);
  }

  async existsByNickname(nickname: string): Promise<boolean> {
    return await this.userRepository.existsByNickname(nickname);
  }
}
