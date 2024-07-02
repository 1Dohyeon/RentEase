import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddressRepository } from 'src/address/address.repository';
import { AddressEntity } from 'src/models/address.entity';
import { UserEntity, UserProfile } from 'src/models/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly userRepository: UserRepository,
    private readonly addressRepository: AddressRepository,
  ) {}

  /**
   * 프로필 정보만 불러옴(nickname, username, addresses)
   * to SettingController.getProfileById
   */
  async getProfileById(userId: number): Promise<UserProfile> {
    if (!userId) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    const user = await this.userRepository.getUserInfoById(userId);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return {
      id: user.id,
      nickname: user.nickname,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      addresses: user.addresses,
    };
  }

  /**
   * 사용자 프로필 업데이트(실명, 닉네임)
   */
  async updateProfile(
    userId: number,
    updateStatus: Partial<UserEntity>,
  ): Promise<UserProfile> {
    const user = await this.getProfileById(userId);

    if (updateStatus.username)
      await this.profileRepository.updateUsername(user, updateStatus.username);
    if (updateStatus.nickname)
      await this.profileRepository.updateNickname(user, updateStatus.nickname);

    return await this.getProfileById(userId);
  }

  /** 사용자 주소만 가져옴 */
  async getAddressesByUserId(userId: number): Promise<AddressEntity[]> {
    const user = await this.getProfileById(userId);
    const addresses = user.addresses;

    if (!addresses) {
      throw new NotFoundException(
        '해당하는 사용자의 주소 정보를 찾을 수 없습니다.',
      );
    }

    return addresses;
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
    const user = await this.getProfileById(userId);

    if (user.addresses.length >= 3) {
      throw new Error('주소는 최대 3개까지만 설정할 수 있습니다.');
    }

    const { city, district } = this.parseAddress(address);

    const addressEntity = await this.addressRepository.findAddress(
      city,
      district,
    );

    if (!addressEntity) {
      throw new NotFoundException('해당 주소를 찾을 수 없습니다.');
    }

    this.checkAddress(user, addressEntity);
    await this.profileRepository.addAddress(user, addressEntity);

    const updatedAddresses = await this.getAddressesByUserId(userId);
    return updatedAddresses;
  }

  /** 사용자 주소 정보 삭제(1개씩) */
  async removeAddress(
    userId: number,
    addressId: number,
  ): Promise<AddressEntity> {
    const user = await this.getProfileById(userId);

    const addressIdToNumber = Number(addressId);
    // 삭제할 주소를 반환하기 위해 미리 변수로 지정
    const addressToRemove = user.addresses.find(
      (address) => address.id === addressIdToNumber,
    );

    await this.profileRepository.removeAddress(user, addressId);

    return addressToRemove;
  }

  /** 사용자 주소 정보 업데이트 */
  async updateAddress(
    userId: number,
    oldAddressId: number,
    newAddress: string,
  ): Promise<AddressEntity[]> {
    const user = await this.getProfileById(userId);

    const { city, district } = this.parseAddress(newAddress);
    const address = await this.addressRepository.findAddress(city, district);

    if (!address) {
      throw new NotFoundException('해당 주소를 찾을 수 없습니다.');
    }

    this.checkAddress(user, address);

    await this.profileRepository.updateAddress(user, oldAddressId, address);

    // 사용자 주소 목록 갱신
    const updatedUser = await this.getProfileById(user.id);
    return updatedUser.addresses;
  }
}
