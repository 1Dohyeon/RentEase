import { BadRequestException, Injectable } from '@nestjs/common';
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
   * user 객체 생성
   * to AuthService.register
   */
  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = this.repository.create(userRegisterDto);
    await this.repository.save(user);

    return this.getUserById(user.id);
  }

  /** ---------- READ ---------- */

  /**
   * id를 통해 user 기본 정보만 불러옴
   */
  async getUserById(userId: number): Promise<UserEntity | undefined> {
    try {
      const user = await this.repository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: userId })
        // password 제외하고 불러옴
        .select([
          'user.id',
          'user.email',
          'user.username',
          'user.nickname',
          'user.createdAt',
          'user.updatedAt',
          'user.deletedAt',
        ])
        .getOne();

      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }

  /**
   * 로그인할 때 리턴 정보.
   * payload의 sub 데이터로 jwt 인증할 때 사용됨.
   * to JwtStrategy.validate
   */
  async getUserBySubForValidate(sub: string): Promise<UserEntity | undefined> {
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
   * email로 user 불러옴
   * to AuthService.verifyUserAndSignJwt
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
   * to userController.getAllUsers
   */
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.repository.find();
  }

  /**
   * to userController.getArticlesByUserId
   */
  async getArticlesByUserId(userId: number): Promise<UserEntity | undefined> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.articles', 'articles')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  /** ---------- UPDATE ---------- */

  /**
   * password 업데이트
   * to AccountService.updatePassword
   */
  async updatePassword(userId: number, hashedPassword: string) {
    const user = await this.getUserById(userId);
    user.password = hashedPassword;
    await this.repository.save(user);

    return {
      id: user.id,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * profile 업데이트
   * to SettingAccount.updateProfile
   */
  async updateProfile(userId: number, updateStatus: Partial<UserEntity>) {
    const user = await this.getUserById(userId);

    // 사용자가 변경한 값만 업데이트
    // Object.assign(user, updateStatus); // 이렇게 해도 아래랑 같은 결과
    if (updateStatus.username) {
      user.username = updateStatus.username;
    }
    if (updateStatus.nickname) {
      user.nickname = updateStatus.nickname;
    }
    await this.repository.save(user);

    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      updatedAt: user.updatedAt,
    };
  }

  /** ---------- DELETE ---------- */

  /**
   * to settingController.deleteUser
   */
  async deleteUserById(userId: number) {
    const deletedUser = await this.getUserById(userId);
    await this.repository.delete(userId);
    return {
      id: deletedUser.id,
      deletedAt: deletedUser.deletedAt,
    };
  }

  /** ---------- db 확인 ---------- */

  /**
   * db안 email 존재 여부 확인
   * to AuthService.register
   * */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.repository.findOne({ where: { email } });
    return !!user; // 이메일이 존재하면 true, 존재하지 않으면 false를 반환
  }

  /**
   * db 안에 nickname 존재 여부 확인
   * to AuthService.register
   */
  async existsByNickname(nickname: string): Promise<boolean> {
    const user = await this.repository.findOne({ where: { nickname } });
    return !!user; // 닉네임 존재하면 true, 존재하지 않으면 false를 반환
  }
}
