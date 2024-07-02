import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { UserRegisterDto } from './dtos/user.register.req';

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
   */
  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = this.repository.create(userRegisterDto);
    return await this.repository.save(user);
  }

  /** ---------- READ ---------- */

  /**
   * id를 통해 기본적인 사용자 정보만 가져옴(다른 사용자도 볼 수 있어야 함)
   */
  async getUserById(userId: number): Promise<UserEntity | undefined> {
    return await this.repository
      .createQueryBuilder('user')
      // 실명과 password 제외
      .select([
        'user.id',
        'user.nickname',
        'address.id',
        'address.city',
        'address.district',
      ])
      .leftJoin('user.addresses', 'address')
      .leftJoin('user.articles', 'article')
      .where('user.id = :id', { id: userId })
      .andWhere('user.isDeleted = false')
      .getOne();
  }

  /**
   * id를 통해 user 모든 정보 불러옴
   */
  async getUserInfoById(userId: number): Promise<UserEntity | undefined> {
    return await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.addresses', 'address')
      .leftJoinAndSelect('user.articles', 'article')
      .where('user.id = :id', { id: userId })
      .andWhere('user.isDeleted = false')
      // password 제외하고 불러옴
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.nickname',
        'user.createdAt',
        'user.updatedAt',
        'address.id',
        'address.city',
        'address.district',
      ])
      .getOne();
  }

  /**
   * 로그인할 때 리턴 정보.
   * payload의 sub 데이터로 jwt 인증할 때 사용됨.
   * to JwtStrategy.validate
   */
  async getUserBySubForValidate(sub: string): Promise<UserEntity | undefined> {
    return await this.repository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.username', 'user.nickname'])
      .where('user.id = :sub', { sub })
      .getOne();
  }

  /**
   * email로 user 불러옴
   * to AuthService.verifyUserAndSignJwt
   */
  async getUserByEmail(email: string): Promise<any | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.repository.find();
  }

  /**
   * id를 통해 기본적인 사용자 정보와 게시글들을 가져옴(다른 사용자도 볼 수 있어야 함)
   */
  async getArticlesByUserId(userId: number): Promise<UserEntity | undefined> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.addresses', 'address')
      .leftJoinAndSelect('user.articles', 'article')
      .leftJoinAndSelect('article.addresses', 'article-address')
      .where('user.id = :userId', { userId })
      .andWhere('user.isDeleted = false')
      .andWhere('article.isDeleted = false')
      .select([
        'user.id',
        'user.nickname',
        'address.id',
        'address.city',
        'address.district',
        'article.id',
        'article.title',
        'article.dailyprice',
        'article.currency',
        'article-address.id',
        'article-address.city',
        'article-address.district',
      ])
      .getOne();
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
