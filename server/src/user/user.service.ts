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
   * @param userRegisterDto 사용자 등록 DTO
   * @returns 등록된 사용자의 정보를 반환
   * @throws BadRequestException 회원가입 실패 시 예외 발생
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

  async updateUser(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.updateUser(user);
  }

  /**
   * 사용자 서브 정보로 유효성 검사를 위한 사용자 조회 서비스 로직
   * @param sub 사용자 서브 정보
   * @returns 해당 서브 정보를 가진 사용자의 정보를 반환
   * @throws NotFoundException 해당하는 사용자를 찾을 수 없는 경우 예외 발생
   */
  async getUserBySubForValidate(sub: string): Promise<UserEntity | undefined> {
    const user = await this.userRepository.getUserBySubForValidate(sub);

    if (!user) {
      throw new NotFoundException(
        '인증 오류 : 해당하는 사용자를 찾을 수 없습니다.',
      );
    }

    return user;
  }

  /**
   * 이메일로 사용자 조회 서비스 로직
   * @param email 사용자 이메일
   * @returns 해당 이메일을 가진 사용자의 정보를 반환
   * @throws NotFoundException 해당하는 사용자를 찾을 수 없는 경우 예외 발생
   */
  async getUserByEmail(email: string): Promise<any | null> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  /**
   * 사용자 ID로 사용자 조회 서비스 로직
   * @param userId 사용자 ID
   * @returns 해당 사용자의 정보를 반환
   * @throws NotFoundException 해당하는 사용자를 찾을 수 없는 경우 예외 발생
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
   * @param userId 사용자 ID
   * @returns 해당 사용자가 작성한 게시글을 포함한 사용자의 정보를 반환
   * @throws NotFoundException 해당하는 사용자와 게시글을 찾을 수 없는 경우 예외 발생
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

  /**
   * 사용자가 작성한 리뷰 조회 서비스 로직
   * @param userId 사용자 ID
   * @returns 해당 사용자가 작성한 리뷰를 포함한 사용자의 정보를 반환
   * @throws NotFoundException 해당하는 사용자와 리뷰를 찾을 수 없는 경우 예외 발생
   */
  async getReviewsByUserId(userId: number): Promise<UserEntity | undefined> {
    const user = await this.userRepository.getReviewsByUserId(userId);

    if (!user) {
      throw new NotFoundException('해당하는 사용자와 리뷰를 찾을 수 없습니다.');
    }

    return user;
  }

  /**
   * 이메일 존재 여부 확인 서비스 로직
   * @param email 사용자 이메일
   * @returns 이메일 존재 여부를 반환
   */
  async existsByEmail(email: string): Promise<boolean> {
    return await this.userRepository.existsByEmail(email);
  }

  /**
   * 닉네임 존재 여부 확인 서비스 로직
   * @param nickname 사용자 닉네임
   * @returns 닉네임 존재 여부를 반환
   */
  async existsByNickname(nickname: string): Promise<boolean> {
    return await this.userRepository.existsByNickname(nickname);
  }
}
