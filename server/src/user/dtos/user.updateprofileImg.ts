import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserProfileImageDto {
  @IsString({ message: '프로필 이미지 URL은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '프로필 이미지 URL을 입력해주세요.' })
  profileImage: string;
}
