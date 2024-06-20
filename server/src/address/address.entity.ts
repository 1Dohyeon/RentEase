import { CommonEntity } from 'src/common/entity/common.entity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('address')
export class AddressEntity extends CommonEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  city: string;

  @PrimaryColumn({ type: 'varchar', nullable: false })
  district: string;

  @ManyToMany(() => UserEntity, (user) => user.addresses)
  users: UserEntity[];
}
