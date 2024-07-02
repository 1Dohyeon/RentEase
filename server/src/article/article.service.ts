import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
   * @returns 모든 게시글의 배너 정보를 반환
   */
  async getAllArticles(): Promise<ArticleBanner[] | undefined> {
    const articles: ArticleBanner[] =
      await this.articleRepository.getAllArticles();

    if (!articles) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return articles;
  }

  /**
   * 특정 카테고리에 속한 게시글 조회
   * @param categoryId 카테고리 ID
   * @returns 해당 카테고리에 속한 게시글의 배너 정보를 반환
   */
  async getArticlesByCategory(
    categoryId: number,
  ): Promise<ArticleBanner[] | undefined> {
    // 카테고리 id 존재 여부 예외 처리
    const category = await this.categoryRepository.findCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException(
        `카테고리 ID ${categoryId}에 해당하는 카테고리를 찾을 수 없습니다.`,
      );
    }

    return await this.articleRepository.getArticlesByCategory(categoryId);
  }

  /**
   * 사용자 주소 정보와 동일한 게시글만 조회
   * @param userId 사용자 ID
   * @param isLocation 위치 기반 검색 여부
   * @returns 사용자 주소 정보와 동일한 게시글의 배너 정보를 반환
   */
  async getArticlesByLocation(
    userId: number,
    isLocation: boolean,
  ): Promise<ArticleBanner[] | undefined> {
    // 위치 기반 검색이 아닌 경우 모든 게시글 반환
    if (!isLocation) {
      return await this.getAllArticles();
    }

    const author = await this.userService.getUserById(userId);

    // 사용자 주소 존재 여부 예외 처리
    if (!author.addresses || author.addresses.length === 0) {
      throw new NotFoundException(
        '사용자 주소를 찾을 수 없습니다. 주소를 설정해주세요.',
      );
    }

    // address id 배열로 저장
    const addressIds = author.addresses.map((address) => address.id);

    return await this.articleRepository.getArticlesByLocation(addressIds);
  }

  /**
   * 특정 카테고리에서 사용자 주소 정보와 동일한 게시글 조회
   * @param userId 사용자 ID
   * @param categoryId 카테고리 ID
   * @param isLocation 위치 기반 검색 여부
   * @returns 해당 카테고리와 사용자 주소 정보와 일치하는 게시글의 배너 정보를 반환
   */
  async getArticlesByCategoryAndLocation(
    userId: number,
    categoryId: number,
    isLocation: boolean,
  ): Promise<ArticleBanner[] | undefined> {
    // 카테고리 id 존재 여부 예외 처리
    const category = await this.categoryRepository.findCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException(
        `카테고리 ID ${categoryId}에 해당하는 카테고리를 찾을 수 없습니다.`,
      );
    }

    // 위치 기반 검색이 아닌 경우 모든 게시글 반환
    if (!isLocation) {
      return await this.getAllArticles();
    }

    const author = await this.userService.getUserById(userId);

    // 사용자 주소 존재 여부 예외 처리
    if (!author.addresses || author.addresses.length === 0) {
      throw new NotFoundException(
        '사용자 주소를 찾을 수 없습니다. 주소를 설정해주세요.',
      );
    }

    // address id 배열로 저장
    const addressIds = author.addresses.map((address) => address.id);

    return await this.articleRepository.getArticlesByCategoryAndLocation(
      categoryId,
      addressIds,
    );
  }

  /**
   * 게시글 생성
   * @param userId 사용자 ID
   * @param title 게시글 제목
   * @param content 게시글 내용
   * @param dailyprice 일일 가격
   * @param currency 통화
   * @param addresses 게시글에 연결할 주소
   * @param categories 게시글에 연결할 카테고리
   * @param weeklyprice 주간 가격 (선택 사항)
   * @param monthlyprice 월간 가격 (선택 사항)
   * @returns 생성된 게시글 정보를 반환
   */
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
    const author = await this.userService.getUserById(userId);

    // 사용자의 주소 중 선택된 주소만 필터링하여 추가
    let selectedAddresses;
    if (addresses) {
      selectedAddresses = author.addresses.filter((address) =>
        addresses.some((selectedAddress) => selectedAddress.id === address.id),
      );
    }

    const newArticle = await this.articleRepository.createArticle(
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

    return await this.getArticleById(newArticle.id);
  }

  /**
   * 게시글 ID로 게시글 정보 조회
   * @param id 게시글 ID
   * @returns 해당 게시글 정보를 반환
   */
  async getArticleById(id: number): Promise<ArticleEntity> {
    const article = await this.articleRepository.getArticleById(id);

    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return article;
  }

  /**
   * 게시글 ID로 상세 게시글 정보 조회
   * @param articleId 게시글 ID
   * @returns 해당 게시글의 상세 정보를 반환
   */
  async getArticleDetailById(
    articleId: number,
  ): Promise<ArticleDetail | undefined> {
    const article =
      await this.articleRepository.getArticleDetailById(articleId);

    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return article;
  }

  /**
   * 게시글 삭제 (soft delete)
   * @param articleId 게시글 ID
   * @returns 삭제된 게시글 정보를 반환
   */
  async deleteArticleById(
    articleId: number,
  ): Promise<ArticleEntity | undefined> {
    const article = await this.getArticleById(articleId);

    if (!article) {
      throw new NotFoundException('해당하는 게시글을 찾을 수 없습니다.');
    }
    try {
      await this.articleRepository.deleteArticleById(articleId);
      return article;
    } catch (err) {
      throw new BadRequestException('알 수 없는 에러로 삭제에 실패하였습니다.');
    }
  }

  /**
   * 게시글 정보 업데이트
   * @param articleId 게시글 ID
   * @param updateStatus 업데이트할 필드와 값
   * @returns 업데이트된 게시글의 상세 정보를 반환
   */
  async updateArticle(
    articleId: number,
    updateStatus: Partial<ArticleEntity>,
  ): Promise<ArticleDetail> {
    // 변경할 필드와 값 준비
    const updateFields: { [key: string]: any } = {};
    const article = await this.getArticleById(articleId);

    if (updateStatus.title && updateStatus.title !== '')
      updateFields.title = updateStatus.title;
    if (updateStatus.content && updateStatus.content !== '')
      updateFields.content = updateStatus.content;
    if (updateStatus.dailyprice)
      updateFields.dailyprice = updateStatus.dailyprice;
    if (updateStatus.weeklyprice)
      updateFields.weeklyprice = updateStatus.weeklyprice;
    if (updateStatus.monthlyprice)
      updateFields.monthlyprice = updateStatus.monthlyprice;
    if (updateStatus.currency) updateFields.currency = updateStatus.currency;

    try {
      await this.articleRepository.updateArticleInfo(articleId, updateFields);
      if (updateStatus.categories) {
        await this.articleRepository.updateArticleCategory(
          article,
          updateStatus.categories,
        );
      }
      if (updateStatus.addresses) {
        await this.articleRepository.updateArticleAddress(
          article,
          updateStatus.addresses,
        );
      }

      return await this.getArticleDetailById(articleId);
    } catch (err) {
      throw new BadRequestException(
        '알 수 없는 에러로 업데이트에 실패하였습니다.',
      );
    }
  }
}
