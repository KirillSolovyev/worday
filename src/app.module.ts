import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DBProvider } from '@/providers/db-provider';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { WordModule } from '@/features/word-module';
import { UserSettingsModule } from '@/features/user-settings';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DBProvider, WordModule, UserSettingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
