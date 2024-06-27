import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user.entity';
import { UserModule } from 'src/user/user.module';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  providers: [AccountRepository, AccountService],
  exports: [AccountRepository, AccountService],
})
export class AccountModule {}
