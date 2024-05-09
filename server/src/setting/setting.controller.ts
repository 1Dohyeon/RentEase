import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Redirect,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccountRepository } from 'src/account/account.repository';
import { AccountService } from 'src/account/account.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ProfileRepository } from 'src/profile/profile.repository';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingController {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly accountService: AccountService,
    private readonly profileRepository: ProfileRepository,
  ) {}

  /**
   * settings/ 로 접근시 /settings/profile 로 리다이렉트
   */
  @Get('/')
  @Redirect('/settings/profile')
  async redirectToProfile() {}

  /**
   * 프로필 정보 조회
   */
  @Get('/profile')
  async getProfileById(@Request() req) {
    const userId = req.user.id;
    return await this.profileRepository.getProfileById(userId);
  }

  /**
   * 프로필 업데이트
   */
  @Patch('/profile')
  async updateProfile() {}

  /**
   *  계정 정보 조회(email, username)
   */
  @Get('/account')
  async getAccountById(@Request() req) {
    const userId = req.user.id;
    return await this.accountRepository.getAccountById(userId);
  }

  /**
   * 계정 삭제
   */
  @Delete('/account/delete-user')
  async deleteAccount(@Request() req) {
    const userId = req.user.id;
    return await this.accountRepository.deleteUserById(userId);
  }

  /**
   * password 업데이트
   */
  @Patch('/account/password')
  async updatePassword(@Request() req, @Body() body) {
    const userId = req.user.id;
    const newPassword = body.newPassword;
    return await this.accountService.updatePassword(userId, newPassword);
  }
}
