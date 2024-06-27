import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/models/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepository implements OnModuleInit {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  async findCategoryById(id: number) {
    const category = await this.repository.findOne({ where: { id } });
    return category;
  }

  async onModuleInit() {
    const categories = [
      { title: '캠핑용' },
      { title: '애견용' },
      { title: '아기용' },
      { title: '시즌용' },
    ];

    for (const category of categories) {
      const exists = await this.repository.findOne({
        where: { title: category.title },
      });
      if (!exists) {
        const newCategory = this.repository.create(category);
        await this.repository.save(newCategory);
      }
    }
  }
}
