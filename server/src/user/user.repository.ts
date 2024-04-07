import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dtos/user.register.req';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  /** ---------- CREATE ---------- */

  /**
   * to AuthService register
   */
  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = this.repository.create(userRegisterDto);
    await this.repository.save(user);

    return this.getCreatedUserById(user.id);
  }

  /** ---------- READ ---------- */

  /**
   * user의 프로필 setting 에서 조회되는 데이터 :
   * id, email, username, nickname,
   * createdAt, updatedAt, deletedAt,
   * articles, teams 반환
   */
  async getReadOnlyUserDataById(
    userId: number,
  ): Promise<UserEntity | undefined> {
    try {
      const user = await this.repository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: userId })
        // =:id는 SQL에서 값이 특정한 값과 동일한지 확인하는 연산자
        .select([
          'user.id',
          'user.email',
          'user.username',
          'user.nickname',
          'user.createdAt',
        ])
        .getOne();

      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }

  /**
   * user login시 사용
   */
  async getUserById(userId: number): Promise<UserEntity | undefined> {
    try {
      const user = await this.repository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: userId })
        .select([
          'user.id',
          'user.email',
          'user.username',
          'user.nickname',
          'user.createdAt',
        ])
        .getOne();

      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }

  /** 로그인할 때 정보 반환.
   * payload의 sub 데이터로 jwt 인증할 때 사용됨.
   * password 없이 userdata 반환
   */
  async findUserByIdWithoutPassword(
    sub: string,
  ): Promise<UserEntity | undefined> {
    try {
      return this.createQueryBuilder('user')
        .addSelect(['user.id', 'user.email', 'user.username', 'user.nickname'])
        .where('user.id = :sub', { sub })
        .getOne();
    } catch (error) {
      throw new BadRequestException(
        '인증 오류 : 해당하는 사용자를 찾을 수 없습니다.',
      );
    }
  }

  /**
   * user를 생성할 때 user의 기본 정보만 반환 :
   * id, email, username, nickname, updatedAt 반환
   */
  async getCreatedUserById(userId: number): Promise<UserEntity | undefined> {
    try {
      const user = await this.repository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: userId })
        .select([
          'user.id',
          'user.email',
          'user.username',
          'user.nickname',
          'user.createdAt',
        ])
        .getOne();

      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }

  /**
   * to AuthService login
   */
  async getUserByEmail(email: string): Promise<any | null> {
    const user = await this.repository.findOne({ where: { email } });

    // 만약 사용자가 존재하지 않으면 null을 반환
    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * user를 업데이트할 때 반환 :
   * id, email, username, nickname, updatedAt 반환
   */
  async getUpdatedUserById(userId: number): Promise<UserEntity | undefined> {
    try {
      const user = await this.repository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: userId })
        .select([
          'user.id',
          'user.email',
          'user.username',
          'user.nickname',
          'user.updatedAt',
        ])
        .getOne();

      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }

  /**
   * user를 삭제할 때 반환 :
   * id, email, username, nickname, deletedAt 반환
   */
  async getDeletedUserById(userId: number): Promise<UserEntity | undefined> {
    try {
      const user = await this.repository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: userId })
        .select(['user.id', 'user.email', 'user.username', 'user.nickname'])
        .getOne();

      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }

  /** user의 프로필 정보만 반환 :
   * user의 id, username, nickname 반환 */
  async getUserProfile(userId: number): Promise<UserEntity | undefined> {
    try {
      const user = await this.repository.findOne({
        where: { id: userId },
        select: ['id', 'username', 'nickname'],
      });

      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new BadRequestException('로그인 세션이 만료되었습니다.');
    }
  }

  /**
   * email만 불러옴
   * to settingController getUserEmail */
  async getUserEmail(userId: number): Promise<UserEntity | undefined> {
    try {
      const user = await this.repository.findOne({
        where: { id: userId },
        select: ['email'],
      });

      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new BadRequestException('로그인 세션이 만료되었습니다.');
    }
  }

  /**
   * to userController getAllUsers
   */
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.repository.find();
  }

  async getUserArticles(userId: number): Promise<UserEntity | undefined> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.articles', 'articles')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  /** ---------- DELETE ---------- */

  /**
   * to settingController deleteUser
   */
  async deleteUser(user: UserEntity): Promise<UserEntity> {
    const deletedUser = await this.getDeletedUserById(user.id);
    await this.repository.delete(user.id);
    return deletedUser;
  }

  /** ---------- ETC ---------- */

  /** db안 email 여부 확인 */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.repository.findOne({ where: { email } });
    return !!user; // 이메일이 존재하면 true, 존재하지 않으면 false를 반환
  }

  /** db안 nickname 여부 확인 */
  async existsByNickname(nickname: string): Promise<boolean> {
    const user = await this.repository.findOne({ where: { nickname } });
    return !!user; // 닉네임 존재하면 true, 존재하지 않으면 false를 반환
  }

  /** email 중복 체크, 중복이면 에러 처리 */
  async checkEmail(user: UserEntity, email: string) {
    const isNicknameExist = await this.existsByEmail(email);
    if (user.email != email && isNicknameExist) {
      throw new UnauthorizedException('이미 존재하는 이메일입니다.');
    }
  }

  /** nickname 중복 체크, 중복이면 에러 처리 */
  async checkNickname(user: UserEntity, nickname: string) {
    const isNicknameExist = await this.existsByNickname(nickname);
    if (user.nickname != nickname && isNicknameExist) {
      throw new UnauthorizedException('이미 존재하는 닉네임입니다.');
    }
  }
}
