import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Redirect,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ProfileService } from 'src/profile/profile.service';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingController {
  constructor(
    private readonly accountService: AccountService,
    private readonly profileService: ProfileService,
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
    return await this.profileService.getProfileById(userId);
  }

  /**
   * 프로필 업데이트
   */
  @Patch('/profile')
  async updateProfile(@Request() req, @Body() body) {
    const userId = req.user.id;
    return await this.profileService.updateProfile(userId, body);
  }

  /**
   * 주소 정보 가져옴
   */
  @Get('/profile/address')
  async getAddress(@Request() req) {
    const userId = req.user.id;
    return this.profileService.getAddresses(userId);
  }

  /**
   * 주소 생성
   */
  @Post('/profile/address')
  async createAdress(@Request() req, @Body('addresses') addresses: string[]) {
    const userId = req.user.id;
    return await this.profileService.addAddress(userId, addresses);
  }

  /**
   * 주소 수정
   */
  @Patch('/profile/address/:id')
  async updateAddress(@Request() req, @Body() body) {
    const userId = req.user.id;
    return await this.profileService.updateProfile(userId, body);
  }

  /**
   *  계정 정보 조회(email, username)
   */
  @Get('/account')
  async getAccountById(@Request() req) {
    const userId = req.user.id;
    return await this.accountService.getAccountById(userId);
  }

  /**
   * 계정 삭제
   */
  @Delete('/account/delete-user')
  async deleteAccount(@Request() req) {
    const userId = req.user.id;
    return await this.accountService.deleteUserById(userId);
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
