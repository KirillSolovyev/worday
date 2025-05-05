import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/entities/user';
import { UserState } from '@/entities/user-state';
import { UserSettingsModule } from '../user-settings-service';
import { UserService } from './service';

export { UserService } from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserState]),
    UserSettingsModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
