import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DBProvider } from '@/providers/db-provider';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { WordModule } from './features/word-module';
import { UserModule } from './entities/user';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DBProvider, WordModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
