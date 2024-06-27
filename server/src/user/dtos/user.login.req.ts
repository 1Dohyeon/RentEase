import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../models/user.entity';

export class UserLoginDto extends PickType(UserEntity, ['email', 'password']) {}
