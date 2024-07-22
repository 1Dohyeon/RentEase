import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CommonEntity } from 'src/common/entity/common.entity';
import { AddressEntity } from 'src/models/address.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BookmarkEntity } from './bookmark.entity';
import { CategoryEntity } from './category.entity';
import { ReviewEntity } from './review.entity';
import { UserEntity } from './user.entity';

export enum Currency {
  USD = 'USD',
  JPY = 'JPY',
  KRW = 'KRW',
}

@Entity({
  name: 'articles',
})
export class ArticleEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', nullable: false })
  content: string;

  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  @JoinColumn({ name: 'dailyprice' })
  dailyprice: number;

  @IsNumber()
  @IsOptional()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @JoinColumn({ name: 'weeklyprice' })
  weeklyprice?: number;

  @IsNumber()
  @IsOptional()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @JoinColumn({ name: 'monthlyprice' })
  monthlyprice?: number;

  @IsEnum(Currency)
  @IsNotEmpty()
  @Column({ type: 'enum', enum: Currency, nullable: false })
  currency: Currency;

  @IsNumber()
  @IsOptional()
  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: false,
    default: 0,
  })
  avgnumofstars: number;

  // 메인 이미지 추가
  @IsOptional()
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  mainImage?: string;

  // true=공개, false=비공개
  @IsBoolean()
  @Column({ type: 'boolean', nullable: true, default: false })
  status: boolean;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  @JoinColumn({ name: 'authorid' })
  author: UserEntity;

  @OneToMany(() => ReviewEntity, (review) => review.article)
  reviews: ReviewEntity[];

  @ManyToMany(() => AddressEntity, (address) => address.articles)
  @JoinTable({
    name: 'articlesaddress',
    joinColumn: { name: 'articleid', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'addressid', referencedColumnName: 'id' },
  })
  addresses: AddressEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.articles)
  @JoinTable({
    name: 'articlescategory',
    joinColumn: { name: 'articleid', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryid', referencedColumnName: 'id' },
  })
  categories: CategoryEntity[];

  @ManyToMany(() => BookmarkEntity, (bookmark) => bookmark.articles)
  @JoinTable({
    name: 'bookmarksarticle',
    joinColumn: { name: 'articleid', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'bookmarkid', referencedColumnName: 'id' },
  })
  bookmarks: BookmarkEntity[];
}

export interface ArticleBanner {
  id: number;
  title: string;
  dailyprice: number;
  currency: Currency;
  createdTimeSince: string;
  author: UserEntity;
  addresses: AddressEntity[];
  categories: CategoryEntity[];
  reviews: ReviewEntity[];
  mainImage?: string;
}

export interface ArticleDetail {
  id: number;
  title: string;
  dailyprice: number;
  currency: Currency;
  createdTimeSince: string;
  author: UserEntity;
  status: boolean;
  addresses: AddressEntity[];
  categories: CategoryEntity[];
  reviews: ReviewEntity[];
  weeklyprice?: number;
  monthlyprice?: number;
  mainImage?: string;
}
