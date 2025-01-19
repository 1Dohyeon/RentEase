import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { BookmarkService } from 'src/bookmark/bookmark.service';
import { UserDto } from 'src/user/dtos/user.dto';
import { UserLoginDto } from 'src/user/dtos/user.login.req';
import { UserRegisterDto } from 'src/user/dtos/user.register.req';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly bookmarkService: BookmarkService,
  ) {}

  /**
   * 회원가입
   * to AuthController.register
   */
  async register(userRegisterDto: UserRegisterDto) {
    const { email, password, username, nickname } = userRegisterDto;

    // email 중복 확인
    const isEmailExist = await this.userService.existsByEmail(email);

    if (isEmailExist) {
      throw new UnauthorizedException('이미 존재하는 이메일입니다.');
    }

    // 닉네임 중복 확인
    const isNicknameExist = await this.userService.existsByNickname(nickname);
    if (isNicknameExist) {
      throw new UnauthorizedException('이미 존재하는 닉네임입니다.');
    }

    // user 데이터 생성
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.createUser({
      email,
      password: hashedPassword,
      username,
      nickname,
    });

    await this.bookmarkService.createBookmark(user.id);

    return user;
  }

  /**
   * 로그인
   * to AuthController.login
   */
  async jwtLogIn(userLoginDto: UserLoginDto, response: Response) {
    const { user, jwt } = await this.verifyUserAndSignJwt(
      userLoginDto.email,
      userLoginDto.password,
    );

    response.cookie('jwt', jwt, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    const loginUser = await this.userService.getUserById(user.id);

    return { loginUser, jwt };
  }

  /**
   * id, password 확인 + jwt 확인
   * to this.jwtLogIn
   */
  async verifyUserAndSignJwt(
    email: UserLoginDto['email'],
    password: UserLoginDto['password'],
  ): Promise<{ jwt: string; user: UserDto }> {
    const user = await this.userService.getUserByEmail(email);
    if (!user)
      throw new UnauthorizedException('해당 이메일 계정은 존재하지 않습니다.');
    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('로그인에 실패하였습니다.');
    try {
      const jwt = await this.jwtService.signAsync(
        { sub: user.id },
        { secret: this.configService.get('JWT_SECRET') },
      );
      return { user, jwt };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
