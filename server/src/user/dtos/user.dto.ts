import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../user.entity';

export class UserDto extends OmitType(UserEntity, ['password'] as const) {}
