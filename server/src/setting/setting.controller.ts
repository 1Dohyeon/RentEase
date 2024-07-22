import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
   * @param req 요청 객체
   * @returns 사용자 프로필 정보를 반환
   */
  @Get('/profile')
  async getProfileById(@Request() req) {
    return await this.profileService.getProfileById(req.user.id);
  }

  /**
   * 프로필 업데이트
   * @param req 요청 객체
   * @param body 업데이트할 프로필 정보
   * @returns 업데이트된 프로필 정보를 반환
   */
  @Patch('/profile')
  async updateProfile(@Request() req, @Body() body) {
    return await this.profileService.updateProfile(req.user.id, body);
  }

  /**
   * 주소 정보 조회
   * @param req 요청 객체
   * @returns 사용자의 주소 정보를 반환
   */
  @Get('/profile/address')
  async getAddress(@Request() req): Promise<AddressEntity[]> {
    return await this.profileService.getAddressesByUserId(req.user.id);
  }

  /**
   * 주소 생성
   * @param req 요청 객체
   * @param address 새로운 주소 정보
   * @returns 생성된 주소 정보를 반환
   */
  @Post('/profile/address')
  @UseGuards(JwtAuthGuard)
  async createAddress(
    @Request() req,
    @Body('address') address: string,
  ): Promise<AddressEntity[]> {
    return await this.profileService.addAddress(req.user.id, address);
  }

  /**
   * 주소 삭제
   * @param userId 사용자 ID
   * @param addressId 주소 ID
   * @returns 삭제된 주소 정보를 반환
   */
  @Delete('/profile/address')
  @UseGuards(JwtAuthGuard)
  async removeAddress(
    @Query('userId') userId: number,
    @Query('addressId') addressId: number,
  ): Promise<AddressEntity> {
    return this.profileService.removeAddress(userId, addressId);
  }

  /**
   * 주소 수정
   * @param userId 사용자 ID
   * @param oldAddressId 기존 주소 ID
   * @param newAddress 새로운 주소 정보
   * @returns 수정된 주소 정보를 반환
   */
  @Patch('/profile/address')
  @UseGuards(JwtAuthGuard)
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
   * 사용자 프로필 이미지 추가
   * @param userId 사용자 ID
   * @param updateUserProfileImageDto 프로필 이미지 URL
   * @returns 업데이트된 사용자 엔티티
   */
  @Patch('/profile/profile-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException(
        '프로필 이미지가 업로드되지 않았습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const profileImage = file.path;
    return await this.profileService.addProfileImage(req.user.id, profileImage);
  }

  /**
   * 사용자 프로필 이미지 삭제
   * @param userId 사용자 ID
   * @returns 업데이트된 사용자 엔티티
   */
  @Delete('/profile/profile-image')
  @UseGuards(JwtAuthGuard)
  async deleteProfileImage(@Request() req) {
    return await this.profileService.deleteProfileImage(req.user.id);
  }

  /**
   * 사용자 프로필 이미지 교체
   * @param userId 사용자 ID
   * @param updateUserProfileImageDto 새로운 프로필 이미지 URL
   * @returns 업데이트된 사용자 엔티티
   */
  @Patch('/profile/profile-image/replace')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async replaceProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException(
        '새로운 프로필 이미지가 업로드되지 않았습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newProfileImage = file.path;
    return await this.profileService.replaceProfileImage(
      req.user.id,
      newProfileImage,
    );
  }

  /**
   * 계정 정보 조회(email, username)
   * @param req 요청 객체
   * @returns 사용자 계정 정보를 반환
   */
  @Get('/account')
  async getAccountById(@Request() req) {
    return await this.accountService.getAccountById(req.user.id);
  }

  /**
   * 계정 삭제 (soft delete)
   * @param req 요청 객체
   * @returns 삭제된 계정 정보를 반환
   */
  @Patch('/account/delete-user')
  async deleteAccount(@Request() req): Promise<UserAccount> {
    const userId = req.user.id;
    return await this.accountService.deleteUserById(userId);
  }

  /**
   * 비밀번호 업데이트
   * @param req 요청 객체
   * @param body 비밀번호 업데이트 정보 (기존 비밀번호, 새로운 비밀번호)
   * @returns 업데이트 결과를 반환
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
