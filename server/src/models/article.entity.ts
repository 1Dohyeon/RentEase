import {
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

  @ManyToOne(() => UserEntity, (user) => user.articles)
  @JoinColumn({ name: 'authorid' })
  author: UserEntity;

  @OneToMany(() => UserEntity, (user) => user.reviews)
  reviews: ReviewEntity[];

  @ManyToMany(() => AddressEntity, (address) => address.articles)
  @JoinTable({
    name: 'articlesaddress',
    joinColumn: { name: 'articleid', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'addressid', referencedColumnName: 'id' },
  })
  addresses: AddressEntity[];
}
