import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/entities/user';
import { UserState } from '@/entities/user-state';
import { UserSettings, UserSettingsService } from '@/entities/user-settings';
import { UserService } from './service';

export { UserService } from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserState]),
    TypeOrmModule.forFeature([UserSettings]),
  ],
  providers: [UserService, UserSettingsService],
  exports: [UserService],
})
export class UserModule {}
