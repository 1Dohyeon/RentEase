import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from 'src/models/address.entity';
import { UserEntity, UserProfile } from 'src/models/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  /**
   * 사용자명 업데이트
   * @param user 업데이트할 사용자 정보
   * @param newUsername 새로운 사용자명
   * @returns 업데이트 결과
   */
  async updateUsername(
    user: UserProfile,
    newUsername: string,
  ): Promise<UpdateResult> {
    return await this.repository
      .createQueryBuilder()
      .update(user)
      .set({ username: newUsername })
      .where('id = :id', { id: user.id })
      .execute();
  }

  /**
   * 닉네임 업데이트
   * @param user 업데이트할 사용자 정보
   * @param newNickname 새로운 닉네임
   * @returns 업데이트 결과
   */
  async updateNickname(
    user: UserProfile,
    newNickname: string,
  ): Promise<UpdateResult> {
    return await this.repository
      .createQueryBuilder()
      .update(user)
      .set({ nickname: newNickname })
      .where('id = :id', { id: user.id })
      .execute();
  }

  /**
   * 사용자 주소 추가 (최대 3개)
   * @param user 주소를 추가할 사용자 정보
   * @param address 추가할 주소 엔티티
   * @returns void
   */
  async addAddress(user: UserProfile, address: AddressEntity): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .relation(UserEntity, 'addresses')
      .of(user.id)
      .add(address.id);
  }

  /**
   * 사용자 주소 삭제 (1개씩)
   * @param user 주소를 삭제할 사용자 정보
   * @param addressId 삭제할 주소의 ID
   * @returns void
   */
  async removeAddress(user: UserProfile, addressId: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .relation(UserEntity, 'addresses')
      .of(user.id)
      .remove(addressId);
  }

  /**
   * 사용자 주소 업데이트
   * @param user 주소를 업데이트할 사용자 정보
   * @param oldAddressId 삭제할 주소의 ID
   * @param newAddressEntity 추가할 새로운 주소 엔티티
   * @returns void
   */
  async updateAddress(
    user: UserProfile,
    oldAddressId: number,
    newAddressEntity: AddressEntity,
  ): Promise<void> {
    await this.removeAddress(user, oldAddressId);
    await this.addAddress(user, newAddressEntity);
  }
  /**
   * 사용자 프로필 이미지 추가
   * @param userId 사용자 ID
   * @param profileImageUrl 프로필 이미지 URL
   * @returns 업데이트된 사용자 엔티티
   * @throws HttpException 사용자를 찾을 수 없는 경우
   */
  async addProfileImage(
    user: UserProfile,
    profileImageUrl: string,
  ): Promise<UserProfile> {
    user.profileImage = profileImageUrl; // 프로필 이미지 추가
    return await this.repository.save(user);
  }

  /**
   * 사용자 프로필 이미지 삭제
   * @param userId 사용자 ID
   * @returns 업데이트된 사용자 엔티티
   * @throws HttpException 사용자를 찾을 수 없는 경우
   */
  async deleteProfileImage(user: UserProfile): Promise<UserEntity> {
    user.profileImage = null; // 프로필 이미지 삭제
    return await this.repository.save(user);
  }

  /**
   * 사용자 프로필 이미지 교체
   * @param userId 사용자 ID
   * @param newProfileImageUrl 새로운 프로필 이미지 URL
   * @returns 업데이트된 사용자 엔티티
   * @throws HttpException 사용자를 찾을 수 없는 경우
   */
  async replaceProfileImage(
    user: UserProfile,
    newProfileImageUrl: string,
  ): Promise<UserEntity> {
    user.profileImage = newProfileImageUrl; // 프로필 이미지 교체
    return await this.repository.save(user);
  }
}
