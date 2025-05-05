import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSettingsService } from './service';
import { UserSettings } from '@/entities/user-settings';

export { UserSettingsService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings])],
  providers: [UserSettingsService],
  exports: [UserSettingsService],
})
export class UserSettingsModule {}
