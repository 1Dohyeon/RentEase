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
   */
  async getArticlesByLocation(
    userId: number,
    isLocation: boolean,
  ): Promise<ArticleBanner[] | undefined> {
    // location이 false이면 모든 게시글을 반환
    // 분명 false인데 예외처리가 제대로 작동 안함...
    console.log(isLocation);
    if (!isLocation) {
      console.log('isLocation 예외처리');
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

    // location이 false이면 모든 게시글을 반환
    // 분명 false인데 예외처리가 제대로 작동 안함...
    console.log(`isLocation: ${isLocation}`);
    if (!isLocation) {
      console.log('isLocation 예외처리');
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

  async getArticleById(id: number): Promise<ArticleEntity> {
    const article = await this.articleRepository.getArticleById(id);

    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return article;
  }

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
          updateStatus,
        );
      }
      if (updateStatus.addresses) {
        await this.articleRepository.updateArticleAddress(
          article,
          updateStatus,
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
