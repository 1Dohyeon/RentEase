import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkEntity } from 'src/models/bookmark.entity';
import { UserModule } from 'src/user/user.module';
import { BookmarkRepository } from './bookmark.repository';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkEntity]), UserModule],
  providers: [BookmarkService, BookmarkRepository],
  exports: [BookmarkService, BookmarkRepository],
  controllers: [BookmarkController],
})
export class BookmarkModule {}
