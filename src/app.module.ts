import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import { DBProvider } from '@/providers/db-provider';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { TelegramBotModule } from '@/modules/telegram-bot';
import { UserSettingsModule } from '@/features/user-settings';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DBProvider,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const telegramBotToken = configService.get<string>('TELEGRAM_BOT_TOKEN');

        if (!telegramBotToken) {
          throw new Error('TELEGRAM_BOT_TOKEN is not defined');
        }

        return {
          token: telegramBotToken,
        };
      },
    }),
    UserSettingsModule,
    TelegramBotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
