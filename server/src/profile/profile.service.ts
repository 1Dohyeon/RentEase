import { BadRequestException, Injectable } from '@nestjs/common';
import { AddressEntity } from 'src/address/address.entity';
import { AddressRepository } from 'src/address/address.repository';
import { UserEntity, UserProfile } from 'src/user/user.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly addressRepository: AddressRepository,
  ) {}

  async getProfileById(userId: number): Promise<UserProfile> {
    return await this.profileRepository.getProfileById(userId);
  }

  async updateProfile(
    userId: number,
    updateStatus: Partial<UserEntity>,
  ): Promise<UserProfile> {
    return await this.profileRepository.updateProfile(userId, updateStatus);
  }

  async getAddresses(userId: number): Promise<AddressEntity[]> {
    return await this.profileRepository.getAddressByUserId(userId);
  }

  async addAddress(
    userId: number,
    addresses: string[],
  ): Promise<AddressEntity[]> {
    const user = await this.profileRepository.getProfileById(userId);

    const existingAddresses = user.addresses.map(
      (addr) => `${addr.city} ${addr.district}`,
    );

    const newAddresses = addresses.filter(
      (address) => !existingAddresses.includes(address),
    );

    if (user.addresses.length + newAddresses.length > 3) {
      throw new BadRequestException('최대 3개의 주소만 추가할 수 있습니다.');
    }

    const addressEntities = await Promise.all(
      newAddresses.map(async (address) => {
        const [city, district] = address.split(' ');
        const foundAddress = await this.addressRepository.findAddress(
          city,
          district,
        );
        if (!foundAddress) {
          throw new BadRequestException(
            `주소를 찾을 수 없습니다: ${city} ${district}`,
          );
        }
        return foundAddress;
      }),
    );

    return await this.profileRepository.addAddress(user, addressEntities);
  }

  async removeAddressByIndex(
    userId: number,
    index: number,
  ): Promise<AddressEntity[]> {
    const user = await this.profileRepository.getProfileById(userId);
    return await this.profileRepository.removeAddressByIndex(user, index);
  }
}
