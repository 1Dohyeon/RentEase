import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
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
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ArticleEntity } from './article.entity';
import { BookmarkEntity } from './bookmark.entity';
import { ReviewEntity } from './review.entity';

@Entity({
  name: 'users',
})
export class UserEntity extends CommonEntity {
  @IsEmail({}, { message: '올바른 형태의 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', nullable: false })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', nullable: false })
  nickname: string;

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  // 프로필 이미지 추가
  @IsOptional()
  @IsString()
  @Column({ type: 'varchar', nullable: true }) // nullable: true로 설정
  profileimage?: string;

  @ManyToMany(() => AddressEntity, (address) => address.users)
  @JoinTable({
    name: 'usersaddress',
    joinColumn: { name: 'userid', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'addressid', referencedColumnName: 'id' },
  })
  addresses: AddressEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.writer)
  reviews: ReviewEntity[];

  @OneToOne(() => BookmarkEntity, { cascade: true })
  @JoinColumn({ name: 'bookmarkid' })
  bookmark: BookmarkEntity;
}

/** 사용자 프로필(실명x, 이메일x) */
export interface UserProfile {
  id: number;
  username: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
  addresses: AddressEntity[];
  profileimage?: string;
}

/** 사용자 계정(실명, 이메일 포함) */
export interface UserAccount {
  id: number;
  username: string;
  email: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
}
