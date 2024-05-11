import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AddressEntity } from 'src/address/address.entity';
import { CommonEntity } from 'src/common/entity/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends CommonEntity {
  @IsEmail({}, { message: '올바른 형태의 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
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
  @Column({ type: 'varchar', unique: true, nullable: false })
  nickname: string;

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses: AddressEntity[];

  // @IsNumber()
  // @Column()
  // manners_point: number;
}

export interface UserProfile {
  id: number;
  username: string;
  nickname: string;
  updatedAt: Date;
}

export interface UserAccount {
  id: number;
  username: string;
  email: string;
  updatedAt: Date;
}
