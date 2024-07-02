import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from 'src/models/address.entity';
import { UserEntity, UserProfile } from 'src/models/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProfileRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

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
}
