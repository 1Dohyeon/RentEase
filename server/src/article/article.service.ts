import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/category/category.repository';
import { AddressEntity } from 'src/models/address.entity';
import {
  ArticleBanner,
  ArticleDetail,
  ArticleEntity,
  Currency,
} from 'src/models/article.entity';
import { CategoryEntity } from 'src/models/category.entity';
import { UserService } from 'src/user/user.service';
import { ArticleRepository } from './article.repository';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * 모든 게시글 조회 (기본)
   */
  async getAllArticles(): Promise<ArticleBanner[] | undefined> {
    try {
      return await this.articleRepository.getAllArticles();
    } catch (err) {
      throw new BadRequestException('AS: 알 수 없는 에러가 발생하였습니다.');
    }
  }

  /**
   * 특정 카테고리에 속한 게시글 조회
   */
  async getArticlesByCategory(
    categoryId: number,
  ): Promise<ArticleBanner[] | undefined> {
    try {
      // 카테고리 id 존재 여부 예외 처리(적용 안됨...)
      const category =
        await this.categoryRepository.findCategoryById(categoryId);

      if (category) {
        return await this.articleRepository.getArticlesByCategory(categoryId);
      }
    } catch (err) {
      throw new BadRequestException('AS: 알 수 없는 에러가 발생하였습니다.');
    }
  }

  /**
   * 사용자 주소 정보와 동일한 게시글만 조회
   */
  async getArticlesByLocation(
    userId: number,
    isLocation: boolean,
  ): Promise<ArticleBanner[] | undefined> {
    // userId 존재 여부 예외 처리
    if (userId) {
      // location이 false이면 모든 게시글을 반환
      // 분명 false인데 예외처리가 제대로 작동 안함...
      console.log(isLocation);
      if (!isLocation) {
        console.log('isLocation 예외처리');
        return await this.articleRepository.getAllArticles();
      }

      const author = await this.userService.getUserById(userId);

      // author 조회 여부 예외 처리
      if (!author) {
        throw new BadRequestException(
          'AS: 사용자를 찾을 수 없습니다. 다시 로그인 해주세요.',
        );
      }

      // 사용자 주소 존재 여부 예외 처리
      if (!author.addresses || author.addresses.length === 0) {
        throw new BadRequestException('AS: 사용자 주소를 설정해주세요.');
      }

      // address id 배열로 저장
      const addressIds = author.addresses.map((address) => address.id);

      return await this.articleRepository.getArticlesByLocation(addressIds);
    } else {
      throw new BadRequestException(
        'AS: 사용자를 찾을 수 없습니다. 다시 로그인 해주세요.',
      );
    }
  }

  /**
   * 특정 카테고리에서 사용자 주소 정보와 동일한 게시글 조회
   */
  async getArticlesByCategoryAndLocation(
    userId: number,
    categoryId: number,
    isLocation: boolean,
  ): Promise<ArticleBanner[] | undefined> {
    // userId 존재 여부 예외 처리
    if (userId) {
      // location이 false이면 모든 게시글을 반환
      // 분명 false인데 예외처리가 제대로 작동 안함...
      console.log(`isLocation: ${isLocation}`);
      if (!isLocation) {
        console.log('isLocation 예외처리');
        return await this.articleRepository.getAllArticles();
      }

      const author = await this.userService.getUserById(userId);

      // 사용자 주소 존재 여부 예외 처리
      if (
        !author.addresses ||
        author.addresses.length === 0 ||
        author.addresses === null
      ) {
        throw new BadRequestException('AS: 사용자 주소를 설정해주세요.');
      }

      // address id 배열로 저장
      const addressIds = author.addresses.map((address) => address.id);

      return await this.articleRepository.getArticlesByCategoryAndLocation(
        categoryId,
        addressIds,
      );
    } else {
      throw new BadRequestException(
        'AS: 사용자를 찾을 수 없습니다. 다시 로그인 해주세요.',
      );
    }
  }

  async createArticle(
    userId: number,
    title: string,
    content: string,
    dailyprice: number,
    currency: Currency,
    addresses: AddressEntity[],
    categories: CategoryEntity[],
    weeklyprice?: number,
    monthlyprice?: number,
  ): Promise<ArticleEntity> {
    try {
      const author = await this.userService.getUserById(userId);

      // 사용자의 주소 중 선택된 주소만 필터링하여 추가
      let selectedAddresses;
      if (addresses) {
        selectedAddresses = author.addresses.filter((address) =>
          addresses.some(
            (selectedAddress) => selectedAddress.id === address.id,
          ),
        );
      }

      return await this.articleRepository.createArticle(
        title,
        content,
        dailyprice,
        currency,
        selectedAddresses,
        author,
        categories,
        weeklyprice,
        monthlyprice,
      );
    } catch (err) {
      throw new BadRequestException('AS: 알 수 없는 에러가 발생하였습니다.');
    }
  }

  async getArticleDetailById(
    articleId: number,
  ): Promise<ArticleDetail | undefined> {
    try {
      return this.articleRepository.getArticleDetailById(articleId);
    } catch (err) {
      throw new BadRequestException('AS: 알 수 없는 에러가 발생하였습니다.');
    }
  }

  async deleteArticleById(
    articleId: number,
  ): Promise<ArticleEntity | undefined> {
    try {
      return this.articleRepository.deleteArticleById(articleId);
    } catch (err) {
      throw new BadRequestException('AS: 알 수 없는 에러가 발생하였습니다.');
    }
  }

  async updateArticle(
    userId: number,
    articleId: number,
    updateStatus: Partial<ArticleEntity>,
  ) {
    try {
      // const author = await this.userService.getUserById(userId);

      // // 사용자의 주소 중 선택된 주소만 필터링하여 추가
      // let selectedAddresses = [];
      // if (updateStatus.addresses) {
      //   selectedAddresses = author.addresses.filter((address) =>
      //     updateStatus.addresses.some(
      //       (selectedAddress) => selectedAddress.id === address.id,
      //     ),
      //   );
      //   // updateStatus.addresses를 유효한 주소로 갱신
      //   updateStatus.addresses = selectedAddresses;
      // }

      return await this.articleRepository.updateArticle(
        articleId,
        updateStatus,
      );
    } catch (err) {
      throw new BadRequestException('AS: 알 수 없는 에러가 발생하였습니다.');
    }
  }
}
