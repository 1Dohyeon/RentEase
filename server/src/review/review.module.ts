import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from 'src/article/article.module';
import { ReviewEntity } from 'src/models/review.entity';
import { UserModule } from 'src/user/user.module';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { ReviewService } from './review.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity]),
    ArticleModule,
    UserModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  exports: [ReviewService, ReviewRepository],
})
export class ReviewModule {}
