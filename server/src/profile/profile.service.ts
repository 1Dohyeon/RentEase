import { Injectable } from '@nestjs/common';
import { AddressRepository } from 'src/address/address.repository';
import { AddressEntity } from 'src/models/address.entity';
import { UserEntity, UserProfile } from 'src/models/user.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly addressRepository: AddressRepository,
  ) {}

  /** 사용자 프로필 정보 가져옴 */
  async getProfileById(userId: number): Promise<UserProfile> {
    return await this.profileRepository.getProfileById(userId);
  }

  /** 사용자 프로필 업데이트(실명, 닉네임) */
  async updateProfile(
    userId: number,
    updateStatus: Partial<UserEntity>,
  ): Promise<UserProfile> {
    return await this.profileRepository.updateProfile(userId, updateStatus);
  }

  /** 사용자 주소만 가져옴 */
  async getAddresses(userId: number): Promise<AddressEntity[]> {
    return await this.profileRepository.getAddressByUserId(userId);
  }

  /** front에서 string으로 입력 받은 주소 정보 split */
  private parseAddress(address: string): { city: string; district: string } {
    const [city, district] = address.split(' ');
    return { city, district };
  }

  /** 사용자가 이미 등록한 주소인지 체크 */
  private checkAddress(user: UserProfile, address: AddressEntity) {
    const existingAddress = user.addresses.find(
      (addr) => addr.id === address.id,
    );
    if (existingAddress) {
      throw new Error('이미 등록된 주소입니다.');
    }
  }

  /** 사용자 주소 정보 추가(최대 3개) */
  async addAddress(userId: number, address: string): Promise<AddressEntity[]> {
    const user = await this.profileRepository.getProfileById(userId);

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    if (user.addresses.length >= 3) {
      throw new Error('주소는 최대 3개까지만 설정할 수 있습니다.');
    }

    const { city, district } = this.parseAddress(address);

    const addressEntity = await this.addressRepository.findAddress(
      city,
      district,
    );

    if (!addressEntity) {
      throw new Error('존재하지 않는 주소입니다.');
    }

    this.checkAddress(user, addressEntity);

    return await this.profileRepository.addAddress(user, addressEntity);
  }

  /** 사용자 주소 정보 삭제(1개씩) */
  async removeAddress(
    userId: number,
    addressId: number,
  ): Promise<AddressEntity> {
    const user = await this.profileRepository.getProfileById(userId);

    if (!user) {
      throw new Error('존재하지 않는 사용자입니다.');
    }
    if (!addressId) {
      throw new Error('존재하지 않는 주소입니다.');
    }

    return await this.profileRepository.removeAddress(user, addressId);
  }

  /** 사용자 주소 정보 업데이트 */
  async updateAddress(
    userId: number,
    oldAddressId: number,
    newAddress: string,
  ): Promise<AddressEntity[]> {
    const user = await this.profileRepository.getProfileById(userId);

    const { city, district } = this.parseAddress(newAddress);
    const address = await this.addressRepository.findAddress(city, district);

    if (!address) {
      throw new Error('존재하지 않는 주소입니다.');
    }

    this.checkAddress(user, address);

    return await this.profileRepository.updateAddress(
      user,
      oldAddressId,
      address,
    );
  }
}
