import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
   * 중복되지 않는 게시글을 Map에 추가하는 메서드
   * @param articleMap 게시글을 담을 Map 객체
   * @param articles 게시글 배열
   */
  private addUniqueArticles(
    articleMap: Map<number, ArticleBanner>,
    articles: ArticleBanner[],
  ) {
    articles.forEach((article) => {
      if (!articleMap.has(article.id)) {
        articleMap.set(article.id, article);
      }
    });
  }

  /**
   * 모든 게시글 조회 사용자 주소와 일치하는 게시글 우선(기본)
   * @param userId 사용자 ID (선택적)
   * @returns 모든 게시글의 배너 정보를 반환
   * @throws {HttpException} 게시글을 찾을 수 없는 경우
   */
  async getAllArticles(userId?: number): Promise<ArticleBanner[] | undefined> {
    if (userId) {
      const user = await this.userService.getUserById(userId);
      const addressIds = user.addresses.map((address) => address.id);

      // 로그인한 사용자이지만 설정한 주소가 없을 경우
      if (addressIds.length === 0) {
        const articles: ArticleBanner[] =
          await this.articleRepository.getAllArticles();

        if (!articles) {
          throw new HttpException(
            '게시글을 찾을 수 없습니다.',
            HttpStatus.BAD_REQUEST,
          );
        }

        return articles;
      }

      // 사용자 주소와 일치하는 게시글 조회
      const articlesByLocation =
        await this.articleRepository.getArticlesByLocation(addressIds);

      // 사용자 주소와 일치하지 않는 게시글 조회
      const articlesNotByLocation =
        await this.articleRepository.getArticlesNotByLocation(addressIds);

      // 두 결과를 결합하고 중복 제거
      const allArticlesMap = new Map<number, ArticleBanner>();
      this.addUniqueArticles(allArticlesMap, articlesByLocation);
      this.addUniqueArticles(allArticlesMap, articlesNotByLocation);

      // Map을 Array로 변환
      const allArticles = Array.from(allArticlesMap.values());

      // 게시글이 없을 경우 예외 처리
      if (!allArticles || allArticles.length === 0) {
        throw new HttpException(
          '게시글을 찾을 수 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return allArticles;
    } else {
      const articles: ArticleBanner[] =
        await this.articleRepository.getAllArticles();

      if (!articles) {
        throw new HttpException(
          '게시글을 찾을 수 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return articles;
    }
  }

  /**
   * 특정 카테고리에 속한 게시글 조회, 사용자 주소와 일치한 게시글 우선
   * @param userId 사용자 ID (선택적)
   * @param categoryId 카테고리 ID
   * @returns 해당 카테고리에 속한 게시글의 배너 정보를 반환
   * @throws {HttpException} 카테고리를 찾을 수 없는 경우 또는 게시글을 찾을 수 없는 경우
   */
  async getArticlesByCategory(
    userId?: number,
    categoryId?: number,
  ): Promise<ArticleBanner[] | undefined> {
    // 카테고리 id 존재 여부 예외 처리
    const category = await this.categoryRepository.getCategoryById(categoryId);
    if (!category) {
      throw new HttpException(
        `카테고리 ID ${categoryId}에 해당하는 카테고리를 찾을 수 없습니다.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 로그인한 사용자일 경우
    if (userId) {
      const user = await this.userService.getUserById(userId);
      const addressIds = user.addresses.map((address) => address.id);

      // 로그인은 했지만 설정한 주소가 없을 경우
      if (addressIds.length === 0) {
        const articles: ArticleBanner[] =
          await this.articleRepository.getArticlesByCategory(categoryId);

        if (!articles) {
          throw new HttpException(
            '게시글을 찾을 수 없습니다.',
            HttpStatus.BAD_REQUEST,
          );
        }

        return articles;
      }

      // 사용자 주소와 일치하는 카테고리의 게시글 조회
      const articlesByLocation =
        await this.articleRepository.getArticlesByCategoryAndLocation(
          categoryId,
          addressIds,
        );

      // 사용자 주소와 일치하지 않는 카테고리의 게시글 조회
      const articlesNotByLocation =
        await this.articleRepository.getArticlesByCategoryAndNotLocation(
          categoryId,
          addressIds,
        );

      // 두 결과를 결합하고 중복 제거
      const allArticlesMap = new Map<number, ArticleBanner>();
      this.addUniqueArticles(allArticlesMap, articlesByLocation);
      this.addUniqueArticles(allArticlesMap, articlesNotByLocation);

      // Map을 Array로 변환
      const allArticles = Array.from(allArticlesMap.values());

      // 게시글이 없을 경우 예외 처리
      if (!allArticles || allArticles.length === 0) {
        throw new HttpException(
          '게시글을 찾을 수 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return allArticles;
    } else {
      return await this.articleRepository.getArticlesByCategory(categoryId);
    }
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
   * @throws HttpException 사용자를 찾을 수 없는 경우
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

    if (!author.addresses) {
      throw new HttpException(
        '사용자의 주소가 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 사용자의 주소 중 선택된 주소만 필터링하여 추가
    let selectedAddresses;
    if (addresses) {
      selectedAddresses = author.addresses.filter((address) =>
        addresses.some((selectedAddress) => selectedAddress.id === address.id),
      );
    }

    if (selectedAddresses.length === 0) {
      throw new HttpException('주소를 설정해주세요.', HttpStatus.BAD_REQUEST);
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
   * @throws HttpException 게시글을 찾을 수 없는 경우
   */
  async getArticleById(id: number): Promise<ArticleEntity> {
    const article = await this.articleRepository.getArticleById(id);

    if (!article) {
      throw new HttpException(
        '게시글을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return article;
  }

  /**
   * 게시글 ID로 상세 게시글 정보 조회
   * @param articleId 게시글 ID
   * @returns 해당 게시글의 상세 정보를 반환
   * @throws HttpException 게시글을 찾을 수 없는 경우
   */
  async getArticleDetailById(
    articleId: number,
  ): Promise<ArticleDetail | undefined> {
    const article =
      await this.articleRepository.getArticleDetailById(articleId);

    if (!article) {
      throw new HttpException(
        '게시글을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return article;
  }

  /**
   * 게시글 삭제 (soft delete)
   * @param articleId 게시글 ID
   * @returns 삭제된 게시글 정보를 반환
   * @throws HttpException 해당하는 게시글을 찾을 수 없는 경우
   * @throws HttpException 삭제에 실패한 경우
   */
  async deleteArticleById(
    articleId: number,
  ): Promise<ArticleEntity | undefined> {
    const article = await this.getArticleById(articleId);

    if (!article) {
      throw new HttpException(
        '해당하는 게시글을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.articleRepository.deleteArticleById(articleId);
      return article;
    } catch (err) {
      throw new HttpException(
        '알 수 없는 에러로 삭제에 실패하였습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 게시글 정보 업데이트
   * @param articleId 게시글 ID
   * @param updateStatus 업데이트할 필드와 값
   * @param mainImageUrl 업데이트할 메인 이미지 URL
   * @returns 업데이트된 게시글의 상세 정보를 반환
   * @throws HttpException 게시글을 찾을 수 없는 경우
   * @throws HttpException 업데이트에 실패한 경우
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

    await this.articleRepository.updateArticleInfo(articleId, updateFields);

    if (updateStatus.categories) {
      await this.articleRepository.updateArticleCategory(
        article,
        updateStatus.categories,
      );
    }
    if (updateStatus.addresses.length === 0) {
      throw new HttpException('주소를 설정해주세요.', HttpStatus.BAD_REQUEST);
    }
    if (updateStatus.addresses) {
      await this.articleRepository.updateArticleAddress(
        article,
        updateStatus.addresses,
      );
    }

    return await this.getArticleDetailById(articleId);
  }

  async addMainImage(
    articleId: number,
    mainImageUrl: string,
  ): Promise<ArticleEntity> {
    await this.articleRepository.updateMainImage(articleId, mainImageUrl);
    return await this.getArticleById(articleId);
  }

  /**
   * 게시글 메인 이미지 삭제
   * @param articleId 게시글 ID
   * @returns 업데이트된 게시글 엔티티
   * @throws HttpException 게시글을 찾을 수 없는 경우
   */
  async deleteMainImage(articleId: number): Promise<ArticleEntity> {
    const article = await this.getArticleById(articleId);

    await this.articleRepository.deleteMainImage(article);
    return await this.getArticleById(articleId);
  }

  /**
   * 게시글 별점 평균 업데이트
   * @param articleId 게시글 ID
   */
  async updateArticleAvgStars(articleId: number) {
    const article = await this.getArticleDetailById(articleId);

    let totalStars = 0;
    let numReviews = 0;

    if (article.reviews && article.reviews.length > 0) {
      article.reviews.forEach((review) => {
        // 애초에 게시글 조회할 때 isDeleted true를 걸러내기에 없어도 되긴 함
        if (!review.isDeleted) {
          totalStars += review.numofstars;
          numReviews++;
        }
      });
    }

    const newAvg = numReviews > 0 ? totalStars / numReviews : 0;
    console.log(newAvg);
    return await this.articleRepository.updateArticleAvgStars(
      articleId,
      newAvg,
    );
  }
}
