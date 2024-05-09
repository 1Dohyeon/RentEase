import {
  Body,
  Controller,
  Delete,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserLoginDto } from 'src/user/dtos/user.login.req';
import { UserRegisterDto } from 'src/user/dtos/user.register.req';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입
   */
  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    return await this.authService.register(userRegisterDto);
  }

  /**
   * 로그인
   */
  @Post('login')
  logIn(
    @Body() userLoginDto: UserLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.jwtLogIn(userLoginDto, response);
  }

  /**
   * 로그아웃
   */
  @Post('logout')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
  }

  /**
   * 계정 삭제
   */
  @Delete('delete-user')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@Request() req) {
    const userId = req.user.id;
    return await this.authService.deleteUser(userId);
  }
}
