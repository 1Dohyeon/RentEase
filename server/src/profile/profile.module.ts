import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from 'src/address/address.module';
import { UserEntity } from 'src/models/user.entity';
import { UserModule } from 'src/user/user.module';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule, AddressModule],
  providers: [ProfileRepository, ProfileService],
  exports: [ProfileRepository, ProfileService],
})
export class ProfileModule {}
