import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/models/category.entity';
import { CategoryRepository } from './category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryModule {}
