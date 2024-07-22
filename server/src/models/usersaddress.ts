// import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { AddressEntity } from './address.entity';
// import { UserEntity } from './user.entity';

// @Entity('usersaddress')
// export class UsersAddressEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => UserEntity, (user) => user.usersAddresses, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'userid' })
//   user: UserEntity;

//   @ManyToOne(() => AddressEntity, (address) => address.usersAddresses, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'addressid' })
//   address: AddressEntity;
// }
