import { Controller, Get, Patch, Redirect, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingController {
  @Get('/')
  @Redirect('/settings/profile')
  async redirectToProfile() {}

  @Get('/profile')
  async getProfile() {}

  @Patch('/profile')
  async updateProfile() {}

  @Get('/account')
  async getUserAccount() {}

  @Patch('/account/email')
  async updateEmail() {}

  @Patch('/account/password')
  async updatePassword() {}
}
