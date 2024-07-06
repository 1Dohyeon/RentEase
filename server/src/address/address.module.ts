import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from '../models/address.entity';
import { AddressRepository } from './address.repository';
import { AddressController } from './address.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  providers: [AddressRepository],
  exports: [AddressRepository],
  controllers: [AddressController],
})
export class AddressModule {}
