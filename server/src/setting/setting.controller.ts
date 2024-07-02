import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { AddressEntity } from 'src/models/address.entity';
import { UserAccount } from 'src/models/user.entity';
import { ProfileService } from 'src/profile/profile.service';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingController {
  constructor(
    private readonly accountService: AccountService,
    private readonly profileService: ProfileService,
  ) {}

  /**
   * 프로필 정보 조회
   */
  @Get('/profile')
  async getProfileById(@Request() req) {
    return await this.profileService.getProfileById(req.user.id);
  }

  /**
   * 프로필 업데이트
   */
  @Patch('/profile')
  async updateProfile(@Request() req, @Body() body) {
    return await this.profileService.updateProfile(req.user.id, body);
  }

  /**
   * 주소 정보만 가져옴
   */
  @Get('/profile/address')
  async getAddress(@Request() req): Promise<AddressEntity[]> {
    return await this.profileService.getAddressesByUserId(req.user.id);
  }

  /**
   * 주소 생성
   */
  @Post('/profile/address')
  async createAdress(
    @Request() req,
    @Body('address') address: string,
  ): Promise<AddressEntity[]> {
    return await this.profileService.addAddress(req.user.id, address);
  }

  /**
   * 주소 삭제 ex) Delete /profile/address?userId=1&addressId=8
   */
  @Delete('/profile/address')
  async removeAddress(
    @Query('userId') userId: number,
    @Query('addressId') addressId: number,
  ): Promise<AddressEntity> {
    return this.profileService.removeAddress(userId, addressId);
  }

  /**
   * 주소 수정 ex) Patch /profile/address?userId=1&addressId=8
   */
  @Patch('/profile/address')
  async updateAddress(
    @Query('userId') userId: number,
    @Query('addressId') oldAddressId: number,
    @Body('newAddress') newAddress: string,
  ): Promise<AddressEntity[]> {
    return await this.profileService.updateAddress(
      userId,
      oldAddressId,
      newAddress,
    );
  }

  /**
   *  계정 정보 조회(email, username)
   */
  @Get('/account')
  async getAccountById(@Request() req) {
    return await this.accountService.getAccountById(req.user.id);
  }

  /**
   * 계정 삭제
   */
  @Patch('/account/delete-user')
  async deleteAccount(@Request() req): Promise<UserAccount> {
    const userId = req.user.id;
    return await this.accountService.deleteUserById(userId);
  }

  /**
   * password 업데이트
   */
  @Patch('/account/password')
  async updatePassword(@Request() req, @Body() body) {
    const userId = req.user.id;
    const oldPassword = body.oldPassword;
    const newPassword = body.newPassword;
    return await this.accountService.updatePassword(
      userId,
      oldPassword,
      newPassword,
    );
  }
}
