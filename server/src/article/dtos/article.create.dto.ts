import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ArticleEntity } from 'src/models/article.entity';

export class ArticleCreateDto extends PickType(ArticleEntity, [
  'title',
  'content',
  'dailyprice',
  'currency',
]) {
  @IsNumber()
  @IsOptional()
  weeklyprice?: number;

  @IsNumber()
  @IsOptional()
  monthlyprice?: number;

  @IsNotEmpty()
  addresses: number[];

  @IsNotEmpty()
  categories: number[];
}
