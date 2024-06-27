import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/models/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity])],
})
export class ReviewModule {}
