import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/entities/user';
import { UserState } from '@/entities/user-state';
import { UserService } from './service';

export { UserService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([UserState])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
