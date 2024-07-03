import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/models/category.entity';
import { CategoryRepository } from './category.repository';
import { CategoryController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategoryRepository],
  exports: [CategoryRepository],
  controllers: [CategoryController],
})
export class CategoryModule {}
