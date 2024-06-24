import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from 'src/models/address.entity';
import { UserEntity, UserProfile } from 'src/models/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly userRepository: UserRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  /**
   * 프로필 정보만 불러옴(nickname, username, addresses)
   * to SettingController.getProfileById
   */
  async getProfileById(userId: number): Promise<UserProfile> {
    const user = await this.userRepository.getUserInfoById(userId);

    // 사용자 정보가 없으면 예외 처리
    if (!user) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return {
      id: user.id,
      nickname: user.nickname,
      username: user.username,
      updatedAt: user.updatedAt,
      addresses: user.addresses,
    };
  }

  /**
   * profile 업데이트
   * to SettingAccount.updateProfile
   */
  async updateProfile(
    userId: number,
    updateStatus: Partial<UserEntity>,
  ): Promise<UserProfile> {
    const user = await this.userRepository.getUserInfoById(userId);

    // 사용자가 변경한 값만 업데이트
    // Object.assign(user, updateStatus); // 이렇게 해도 아래랑 같은 결과
    if (updateStatus.username) {
      user.username = updateStatus.username;
    }
    if (updateStatus.nickname) {
      user.nickname = updateStatus.nickname;
    }
    await this.repository.save(user);

    return await this.getProfileById(userId);
  }

  async getAddressByUserId(
    userId: number,
  ): Promise<AddressEntity[] | undefined> {
    const user = await this.getProfileById(userId);

    return user.addresses;
  }

  /** 사용자 주소 정보 추가(최대 3개) */
  async addAddress(
    user: UserProfile,
    address: AddressEntity,
  ): Promise<AddressEntity[]> {
    console.log(`profile.repository: ${JSON.stringify(address)}`);

    try {
      await this.repository
        .createQueryBuilder()
        .relation(UserEntity, 'addresses')
        .of(user.id)
        .add(address.id);

      /**
       * 아래 쿼리문은 usersaddress과 users, address 테이블의 ManyToMany의 관계형 테이블임을 알고 있어야함
       * 위 쿼리문은 relation을 통해서 어떤 테이블들의 관계를 나타내는지 알 수 있음
       * 따라서 취향 차이임
       * 둘 다 쿼리문으로 변형하면 아래와 같음 :
       * INSERT INTO usersaddress (userId, addressId) VALUES (user.id, address.id); */

      // await this.repository
      //   .createQueryBuilder()
      //   .insert()
      //   .into('usersaddress')
      //   .values({ userid: user.id, addressid: address.id })
      //   .execute();

      // 사용자 주소 목록 갱신
      const updatedUser = await this.getProfileById(user.id);
      return updatedUser.addresses;
    } catch (err) {
      throw new Error(`주소 추가 중 에러 발생: ${err.message}`);
    }
  }

  /** 사용자 주소 정보 삭제(1개씩) */
  async removeAddress(
    user: UserProfile,
    addressId: number,
  ): Promise<AddressEntity> {
    // addressId가 숫자인지 확인
    const addressIdToNumber = Number(addressId);
    console.log(addressIdToNumber);
    console.log(user.addresses);

    const addressToRemove = user.addresses.find(
      (address) => address.id === addressIdToNumber,
    );
    if (!addressToRemove) {
      throw new Error('주소가 없습니다.');
    }

    try {
      await this.repository
        .createQueryBuilder()
        .relation(UserEntity, 'addresses')
        .of(user.id)
        .remove(addressId);

      return addressToRemove;
    } catch (err) {
      throw new Error(`저장 중 에러 발생: ${err.message}`);
    }
  }

  /** 사용자 주소 정보 업데이트 */
  async updateAddress(
    user: UserProfile,
    oldAddressId: number,
    newAddressEntity: AddressEntity,
  ): Promise<AddressEntity[]> {
    try {
      // 관계형 db 중복 이슈로 삭제 후 추가로 변경
      await this.removeAddress(user, oldAddressId);
      await this.addAddress(user, newAddressEntity);

      // 사용자 주소 목록 갱신
      const updatedUser = await this.getProfileById(user.id);
      return updatedUser.addresses;
    } catch (err) {
      throw new Error(`주소 업데이트 중 에러 발생: ${err.message}`);
    }
  }
}
