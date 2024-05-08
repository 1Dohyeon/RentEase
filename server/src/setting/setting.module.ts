import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';

@Module({
  imports: [AccountModule],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
