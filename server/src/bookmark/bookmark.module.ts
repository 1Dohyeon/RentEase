import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkEntity } from 'src/models/bookmark.entity';
import { UserModule } from 'src/user/user.module';
import { BookmarkRepository } from './bookmark.repository';
import { BookmarkService } from './bookmark.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkEntity]), UserModule],
  providers: [BookmarkService, BookmarkRepository],
  exports: [BookmarkService, BookmarkRepository],
})
export class BookmarkModule {}
