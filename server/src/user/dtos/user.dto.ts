import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../../models/user.entity';

export class UserDto extends OmitType(UserEntity, ['password'] as const) {}
