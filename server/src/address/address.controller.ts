import { Controller, Get } from '@nestjs/common';
import { AddressEntity } from 'src/models/address.entity';
import { AddressRepository } from './address.repository';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressRepository: AddressRepository) {}

  @Get()
  async getAllAddresses(): Promise<AddressEntity[]> {
    return await this.addressRepository.getAllAddresses();
  }
}
