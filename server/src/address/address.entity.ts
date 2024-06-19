import { CommonEntity } from 'src/common/entity/common.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('address')
export class AddressEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  country: string;

  @Column({ type: 'varchar', nullable: false })
  district: string;

  @ManyToMany(() => UserEntity, (user) => user.addresses)
  users: UserEntity[];
}
