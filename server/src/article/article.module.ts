import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/models/article.entity';
import { ArticleController } from './article.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ArticleController],
})
export class ArticleModule {}
