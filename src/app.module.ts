import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SentryModule, SentryGlobalFilter } from '@sentry/nestjs/setup';
import { TelegrafModule } from 'nestjs-telegraf';

import { DBProvider } from '@/providers/db-provider';

import { TelegramBotModule } from '@/modules/telegram-bot';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SentryModule.forRoot(),
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
    TelegramBotModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
