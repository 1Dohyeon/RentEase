import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './address.entity';
import { AddressRepository } from './address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  providers: [AddressRepository],
  exports: [AddressRepository],
})
export class AddressModule {}
