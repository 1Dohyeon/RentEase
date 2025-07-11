import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /** 해당 열이 추가된 시각을 자동으로 기록
   * 만일 Postgres의 time zone이 'UTC'라면 UTC 기준으로 출력하고 'Asia/Seoul'라면 서울 기준으로 출력한다.
   * DB SQL QUERY : set time zone 'Asia/Seoul'; set time zone 'UTC'; show timezone;
   */
  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  createdTimeSince: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  // Soft Delete : 기존에는 null, 삭제시에 timestamp를 찍는다.
  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date | null;
}
