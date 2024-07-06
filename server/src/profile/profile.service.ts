import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
   * 사용자 프로필 정보 조회
   * @param userId 조회할 사용자의 ID
   * @returns 사용자 프로필 정보 (id, nickname, username, createdAt, updatedAt, addresses)
   * @throws BadRequestException 사용자 ID가 없을 경우
   * @throws NotFoundException 해당하는 사용자를 찾을 수 없을 경우
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
   * 사용자 프로필 업데이트
   * @param userId 업데이트할 사용자의 ID
   * @param updateStatus 업데이트할 정보 (username, nickname)
   * @returns 업데이트된 사용자 프로필 정보
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

  /**
   * 사용자 주소 목록 조회
   * @param userId 주소를 조회할 사용자의 ID
   * @returns 사용자의 주소 목록
   * @throws NotFoundException 주소를 찾을 수 없는 경우
   */
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

  /**
   * 주소 문자열을 파싱하여 주소 엔티티 검색
   * @param address 주소 문자열
   * @returns { city: string, district: string } 주소의 도시와 구 정보
   * @throws Error 주소 문자열이 유효하지 않을 경우 예외 발생
   */
  private parseAddress(address: string): { city: string; district: string } {
    if (!address || typeof address !== 'string') {
      throw new Error('주소 문자열이 유효하지 않습니다.');
    }

    const parts = address.split(' ');

    if (parts.length !== 2) {
      throw new Error(
        '주소 문자열 형식이 올바르지 않습니다. 도시와 구를 포함해야 합니다.',
      );
    }

    const [city, district] = parts;

    return { city, district };
  }

  /**
   * 이미 등록된 주소인지 확인
   * @param user 사용자 정보
   * @param address 주소 엔티티
   * @throws Error 이미 등록된 주소인 경우
   */
  private checkAddress(user: UserProfile, address: AddressEntity) {
    const existingAddress = user.addresses.find(
      (addr) => addr.id === address.id,
    );
    if (existingAddress) {
      throw new Error('이미 등록된 주소입니다.');
    }
  }

  /**
   * 사용자 주소 추가 (최대 3개)
   * @param userId 주소를 추가할 사용자의 ID
   * @param address 추가할 주소 문자열
   * @returns 업데이트된 사용자 주소 목록
   * @throws Error 주소 추가 제한에 걸린 경우
   * @throws NotFoundException 주소를 찾을 수 없는 경우
   */
  async addAddress(userId: number, address: string): Promise<AddressEntity[]> {
    try {
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
    } catch (error) {
      // 예외 처리 후 클라이언트로 에러 응답 전송
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 사용자 주소 삭제
   * @param userId 주소를 삭제할 사용자의 ID
   * @param addressId 삭제할 주소의 ID
   * @returns 삭제된 주소 엔티티
   */
  async removeAddress(
    userId: number,
    addressId: number,
  ): Promise<AddressEntity> {
    try {
      const user = await this.getProfileById(userId);

      const addressIdToNumber = Number(addressId);
      const addressToRemove = user.addresses.find(
        (address) => address.id === addressIdToNumber,
      );

      await this.profileRepository.removeAddress(user, addressId);

      return addressToRemove;
    } catch (error) {
      // 예외 처리 후 클라이언트로 에러 응답 전송
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 사용자 주소 업데이트
   * @param userId 업데이트할 사용자의 ID
   * @param oldAddressId 업데이트 전 주소의 ID
   * @param newAddress 새로운 주소 문자열
   * @returns 업데이트된 사용자 주소 목록
   * @throws NotFoundException 주소를 찾을 수 없는 경우
   * @throws Error 이미 등록된 주소인 경우
   */
  async updateAddress(
    userId: number,
    oldAddressId: number,
    newAddress: string,
  ): Promise<AddressEntity[]> {
    try {
      const user = await this.getProfileById(userId);

      const { city, district } = this.parseAddress(newAddress);
      const address = await this.addressRepository.findAddress(city, district);

      if (!address) {
        throw new NotFoundException('해당 주소를 찾을 수 없습니다.');
      }

      this.checkAddress(user, address);

      await this.profileRepository.updateAddress(user, oldAddressId, address);

      const updatedUser = await this.getProfileById(user.id);
      return updatedUser.addresses;
    } catch (error) {
      // 예외 처리 후 클라이언트로 에러 응답 전송
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
