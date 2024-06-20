import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './address.entity';
import { AddressRepository } from './address.repository';
import { AddressService } from './address.service';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  providers: [AddressService, AddressRepository],
  exports: [AddressService, AddressRepository],
})
export class AddressModule {}
