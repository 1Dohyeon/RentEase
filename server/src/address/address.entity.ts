import { CommonEntity } from 'src/common/entity/common.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('address')
export class AddressEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  country: string;

  @Column({ type: 'varchar', nullable: false })
  district: string;

  @ManyToOne(() => UserEntity, (user) => user.addresses)
  user: UserEntity;
}
