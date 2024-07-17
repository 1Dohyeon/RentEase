import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AddressModule } from 'src/address/address.module';
import { CategoryModule } from 'src/category/category.module';
import { ArticleEntity } from 'src/models/article.entity';
import { UserModule } from 'src/user/user.module';
import { ArticleController } from './article.controller';
import { ArticleRepository } from './article.repository';
import { ArticleService } from './article.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/article-images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
    TypeOrmModule.forFeature([ArticleEntity, ArticleRepository]),
    UserModule,
    AddressModule,
    CategoryModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository],
  exports: [ArticleService, ArticleRepository],
})
export class ArticleModule {}
