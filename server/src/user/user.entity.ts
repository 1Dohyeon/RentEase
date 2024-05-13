import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entity/common.entity';
import { Column, Entity } from 'typeorm';

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

  // @IsNumber()
  // @Column()
  // manners_point: number;

  // @OneToMany(() => AddressEntity, (address) => address.user)
  // addresses: AddressEntity[];
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
