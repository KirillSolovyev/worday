import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserModule } from '@/services/user-service';
import { UserSettings } from '@/entities/user-settings';
import { UserSettingsService } from './service';
import { UserSettingsController } from './controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings]), UserModule],
  exports: [UserSettingsService],
  providers: [UserSettingsService],
  controllers: [UserSettingsController],
})
export class UserSettingsModule {}
