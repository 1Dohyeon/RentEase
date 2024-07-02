import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../models/user.entity';
import { UserRegisterDto } from './dtos/user.register.req';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * 회원가입 서비스 로직
   */
  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const createdUser = await this.userRepository.createUser(userRegisterDto);

    if (!createdUser) {
      throw new BadRequestException('회원가입에 실패하였습니다.');
    }

    const user = await this.userRepository.getUserInfoById(createdUser.id);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async getUserBySubForValidate(sub: string): Promise<UserEntity | undefined> {
    const user = await this.userRepository.getUserBySubForValidate(sub);

    if (!user) {
      throw new NotFoundException(
        '인증 오류 : 해당하는 사용자를 찾을 수 없습니다.',
      );
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<any | null> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  /**
   * 사용자 조회 서비스 로직
   */
  async getUserById(userId: number): Promise<UserEntity | undefined> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  /**
   * 사용자가 작성한 게시글 조회 서비스 로직
   */
  async getArticlesByUserId(userId: number): Promise<UserEntity | undefined> {
    const user = await this.userRepository.getArticlesByUserId(userId);

    if (!user) {
      throw new NotFoundException(
        '해당하는 사용자와 게시글을 찾을 수 없습니다.',
      );
    }

    return user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return await this.userRepository.existsByEmail(email);
  }

  async existsByNickname(nickname: string): Promise<boolean> {
    return await this.userRepository.existsByNickname(nickname);
  }
}
