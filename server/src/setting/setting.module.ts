import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { ProfileModule } from 'src/profile/profile.module';
import { SettingController } from './setting.controller';

@Module({
  imports: [AccountModule, ProfileModule],
  controllers: [SettingController],
})
export class SettingModule {}
