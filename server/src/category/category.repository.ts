import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/models/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepository implements OnModuleInit {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  async findCategoryById(id: number): Promise<CategoryEntity> {
    try {
      const category = await this.repository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException(
          `카테고리 ID ${id}에 해당하는 카테고리를 찾을 수 없습니다.`,
        );
      }
      return category;
    } catch (err) {
      throw new BadRequestException('CR: 알 수 없는 에러가 발생하였습니다.');
    }
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
