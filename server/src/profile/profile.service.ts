import { Injectable } from '@nestjs/common';
import { AddressEntity } from 'src/address/address.entity';
import { UserEntity, UserProfile } from 'src/user/user.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

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
}
