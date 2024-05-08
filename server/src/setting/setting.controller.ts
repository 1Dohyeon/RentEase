import {
  Controller,
  Get,
  Patch,
  Redirect,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccountRepository } from 'src/account/account.repository';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingController {
  constructor(private readonly accountRepository: AccountRepository) {}

  @Get('/')
  @Redirect('/settings/profile')
  async redirectToProfile() {}

  @Get('/profile')
  async getProfile() {}

  @Patch('/profile')
  async updateProfile() {}

  @Get('/account')
  async getUserAccount(@Request() req) {
    const userId = req.user.id;
    return await this.accountRepository.getProfile(userId);
  }

  @Patch('/account/email')
  async updateEmail() {}

  @Patch('/account/password')
  async updatePassword() {}
}
