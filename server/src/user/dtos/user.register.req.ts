import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../models/user.entity';

export class UserRegisterDto extends PickType(UserEntity, [
  'email',
  'password',
  'username',
  'nickname',
]) {}
