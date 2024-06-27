import { Injectable } from '@nestjs/common';
import { AddressEntity } from 'src/models/address.entity';
import { ArticleEntity, Currency } from 'src/models/article.entity';
import { CategoryEntity } from 'src/models/category.entity';
import { UserService } from 'src/user/user.service';
import { ArticleRepository } from './article.repository';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly userService: UserService,
  ) {}

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
  }

  async getArticleById(articleId: number): Promise<ArticleEntity | undefined> {
    return this.articleRepository.getArticleById(articleId);
  }

  async deleteArticleById(
    articleId: number,
  ): Promise<ArticleEntity | undefined> {
    return this.articleRepository.deleteArticleById(articleId);
  }

  async updateArticle(articleId: number, updateStatus: Partial<ArticleEntity>) {
    return await this.articleRepository.updateArticle(articleId, updateStatus);
  }
}
