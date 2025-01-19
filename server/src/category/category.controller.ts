import { Controller, Get } from '@nestjs/common';
import { CategoryRepository } from './category.repository';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  @Get()
  async getAllCategories() {
    return await this.categoryRepository.getAllCategories();
  }
}
