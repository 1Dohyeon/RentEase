import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { ProfileRepository } from './profile.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  providers: [ProfileRepository],
  exports: [ProfileRepository],
})
export class ProfileModule {}
