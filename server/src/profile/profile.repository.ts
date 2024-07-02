import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from 'src/models/address.entity';
import { UserEntity, UserProfile } from 'src/models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  /**
   * profile 업데이트
   * to SettingAccount.updateProfile
   */
  async updateUsername(user: UserProfile, newUsername: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(user)
      .set({ username: newUsername })
      .where('id = :id', { id: user.id })
      .execute();
  }

  async updateNickname(user: UserProfile, newNickname: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(user)
      .set({ nickname: newNickname })
      .where('id = :id', { id: user.id })
      .execute();
  }

  /** 사용자 주소 정보 추가(최대 3개) */
  async addAddress(user: UserProfile, address: AddressEntity) {
    await this.repository
      .createQueryBuilder()
      .relation(UserEntity, 'addresses')
      .of(user.id)
      .add(address.id);
  }

  /** 사용자 주소 정보 삭제(1개씩) */
  async removeAddress(user: UserProfile, addressId: number) {
    await this.repository
      .createQueryBuilder()
      .relation(UserEntity, 'addresses')
      .of(user.id)
      .remove(addressId);
  }

  /** 사용자 주소 정보 업데이트 */
  async updateAddress(
    user: UserProfile,
    oldAddressId: number,
    newAddressEntity: AddressEntity,
  ) {
    await this.removeAddress(user, oldAddressId);
    await this.addAddress(user, newAddressEntity);
  }
}
