import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timeSince } from 'src/helper/timeSince';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { UserRegisterDto } from './dtos/user.register.req';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  /**
   * 사용자 등록 서비스 로직
   * @param userRegisterDto 사용자 등록 DTO
   * @returns 등록된 사용자 객체를 반환
   */
  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = this.repository.create(userRegisterDto);
    return await this.repository.save(user);
  }

  /**
   * 사용자 ID를 이용해 기본적인 사용자 정보를 가져오는 서비스 로직
   * @param userId 사용자 ID
   * @returns 기본적인 사용자 정보를 포함한 사용자 객체를 반환
   */
  async getUserById(userId: number): Promise<UserEntity | undefined> {
    return await this.repository
      .createQueryBuilder('user')
      // 사용자 실명과 비밀번호를 제외한 필드 선택
      .select([
        'user.id',
        'user.nickname',
        'address.id',
        'address.city',
        'address.district',
        'bookmark.id',
      ])
      .leftJoin('user.addresses', 'address')
      .leftJoin('user.articles', 'article')
      .leftJoin('user.bookmark', 'bookmark')
      .where('user.id = :id', { id: userId })
      .andWhere('user.isDeleted = false')
      .getOne();
  }

  /**
   * 사용자 ID를 이용해 모든 사용자 정보를 가져오는 서비스 로직
   * @param userId 사용자 ID
   * @returns 모든 사용자 정보를 포함한 사용자 객체를 반환
   */
  async getUserInfoById(userId: number): Promise<UserEntity | undefined> {
    return await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.addresses', 'address')
      .leftJoinAndSelect('user.articles', 'article')
      .where('user.id = :id', { id: userId })
      .andWhere('user.isDeleted = false')
      // 비밀번호를 제외하고 필드 선택
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.nickname',
        'user.createdAt',
        'user.updatedAt',
        'user.profileimage',
        'address.id',
        'address.city',
        'address.district',
      ])
      .getOne();
  }

  /**
   * 사용자 서브 정보로 유효성 검사를 위해 사용자를 조회하는 서비스 로직
   * @param sub 사용자 서브 정보
   * @returns 주어진 서브 정보를 가진 사용자 객체를 반환
   */
  async getUserBySubForValidate(sub: string): Promise<UserEntity | undefined> {
    return await this.repository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.username', 'user.nickname'])
      .where('user.id = :sub', { sub })
      .getOne();
  }

  /**
   * 이메일로 사용자를 조회하는 서비스 로직
   * @param email 사용자 이메일
   * @returns 주어진 이메일을 가진 사용자 객체를 반환
   */
  async getUserByEmail(email: string): Promise<any | null> {
    return await this.repository.findOne({ where: { email } });
  }

  /**
   * 모든 사용자를 가져오는 서비스 로직
   * @returns 모든 사용자 객체의 배열을 반환
   */
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.repository.find({ where: { isDeleted: false } });
  }

  /**
   * 사용자 ID를 이용해 사용자가 작성한 게시글을 포함한 정보를 가져오는 서비스 로직
   * @param userId 사용자 ID
   * @returns 사용자가 작성한 게시글을 포함한 사용자 객체를 반환
   */
  async getArticlesByUserId(userId: number): Promise<UserEntity | undefined> {
    return await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.addresses', 'address')
      .leftJoinAndSelect('user.articles', 'article')
      .leftJoinAndSelect('article.addresses', 'article-address')
      .where('user.id = :userId', { userId })
      .andWhere('user.isDeleted = false')
      .andWhere('article.isDeleted = false')
      .andWhere('article.status = true')
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

  async getArticlesAllByUserId(
    userId: number,
  ): Promise<UserEntity | undefined> {
    return await this.repository
      .createQueryBuilder('user')
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

  /**
   * 사용자 ID를 이용해 사용자가 작성한 리뷰를 포함한 정보를 가져오는 서비스 로직
   * @param userId 사용자 ID
   * @returns 사용자가 작성한 리뷰를 포함한 사용자 객체를 반환
   */
  async getReviewsByUserId(userId: number): Promise<UserEntity | undefined> {
    const user = await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.addresses', 'address')
      .leftJoinAndSelect('user.reviews', 'review')
      .leftJoinAndSelect('review.writer', 'writer')
      .leftJoinAndSelect('review.article', 'article')
      .where('user.id = :userId', { userId })
      .andWhere('user.isDeleted = false')
      .andWhere('review.isDeleted = false')
      .andWhere('article.isDeleted = false')
      .select([
        'user.id',
        'user.nickname',
        'address.id',
        'address.city',
        'address.district',
        'review.id',
        'review.numofstars',
        'review.content',
        'review.createdTimeSince',
        'writer.id',
        'writer.nickname',
        'article.id',
        'article.title',
      ])
      .getOne();

    if (user && user.reviews) {
      user.reviews = user.reviews.map((review) => ({
        ...review,
        createdTimeSince: timeSince(review.createdTimeSince),
      }));
    }

    return user;
  }

  /**
   * 사용자 ID를 이용해 사용자가 등록한 북마크 목록을 가져오는 서비스 로직
   * @param userId 사용자 ID
   * @returns 사용자가 작성한 리뷰를 포함한 사용자 객체를 반환
   */
  async getBookmarksByUserId(userId: number): Promise<UserEntity | undefined> {
    return await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.addresses', 'address')
      .leftJoinAndSelect('user.bookmark', 'bookmark')
      .leftJoinAndSelect('bookmark.articles', 'article')
      .leftJoinAndSelect('article.addresses', 'article_address')
      .where('user.id = :userId', { userId })
      .andWhere('user.isDeleted = false')
      // .andWhere('article.isDeleted = false')
      .select([
        'user.id',
        'user.nickname',
        'address.id',
        'address.city',
        'address.district',
        'bookmark.id',
        'article.id',
        'article.title',
        'article.dailyprice',
        'article.currency',
        'article_address.id',
        'article_address.city',
        'article_address.district',
      ])
      .getOne();
  }

  async updateUser(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }

  /**
   * 주어진 이메일이 데이터베이스에 존재하는지 확인하는 서비스 로직
   * @param email 사용자 이메일
   * @returns 이메일 존재 여부를 반환 (true: 존재, false: 미존재)
   */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.repository.findOne({ where: { email } });
    return !!user; // 이메일이 존재하면 true, 존재하지 않으면 false를 반환
  }

  /**
   * 주어진 닉네임이 데이터베이스에 존재하는지 확인하는 서비스 로직
   * @param nickname 사용자 닉네임
   * @returns 닉네임 존재 여부를 반환 (true: 존재, false: 미존재)
   */
  async existsByNickname(nickname: string): Promise<boolean> {
    const user = await this.repository.findOne({
      where: { nickname, isDeleted: false },
    });
    return !!user; // 닉네임이 존재하면 true, 존재하지 않으면 false를 반환
  }
}
