import { Injectable } from '@nestjs/common';
import { AddressRepository } from './address.repository';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async onModuleInit() {
    return await this.addressRepository.onModuleInit();
  }
}
