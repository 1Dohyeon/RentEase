import { Controller, Get, Redirect } from '@nestjs/common';

@Controller('settings')
export class SettingController {
  @Get('/')
  @Redirect('/settings/profile')
  async redirectToProfile() {}
}
