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

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingController {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly accountService: AccountService,
  ) {}

  @Get('/')
  @Redirect('/settings/profile')
  async redirectToProfile() {}

  @Get('/profile')
  async getProfile() {}

  @Patch('/profile')
  async updateProfile() {}

  @Get('/account')
  async getAccount(@Request() req) {
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

  @Patch('/account/password')
  async updatePassword(@Request() req, @Body() body) {
    const userId = req.user.id;
    const newPassword = body.newPassword;
    return await this.accountService.updatePassword(userId, newPassword);
  }
}
