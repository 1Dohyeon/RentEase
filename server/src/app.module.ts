import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { AddressModule } from './address/address.module';
import { AppController } from './app.controller';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CategoryModule } from './category/category.module';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { AddressEntity } from './models/address.entity';
import { ArticleEntity } from './models/article.entity';
import { BookmarkEntity } from './models/bookmark.entity';
import { CategoryEntity } from './models/category.entity';
import { ReviewEntity } from './models/review.entity';
import { UserEntity } from './models/user.entity';
import { ProfileModule } from './profile/profile.module';
import { ReviewModule } from './review/review.module';
import { SettingModule } from './setting/setting.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true, // 배포환경에서는 false
      logging: true,
      entities: [
        UserEntity,
        AddressEntity,
        ArticleEntity,
        ReviewEntity,
        CategoryEntity,
        BookmarkEntity,
      ],
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    SettingModule,
    AccountModule,
    ProfileModule,
    ArticleModule,
    AddressModule,
    ReviewModule,
    CategoryModule,
    BookmarkModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 소비자에게 LoggerMiddleware 제공, 전체 엔드포인트에 대해서 LoggerMiddleware 실행
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
