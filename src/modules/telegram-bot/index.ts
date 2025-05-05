import { Module } from '@nestjs/common';

import { UserSettingsModule } from '@/services/user-settings-service';
import { GeminiModule } from '@/services/gemini';
import { UserModule } from '@/services/user-service';
import { WordsModule } from '@/services/words-service';
import { LanguageModule } from '@/features/language-module';
import { WordOfDayModule } from '@/features/word-of-day-module';

import { TelegramBotUpdateService } from './service';
import { TelegramBotStateService } from './model';

@Module({
  imports: [
    GeminiModule,
    UserModule,
    UserSettingsModule,
    WordsModule,
    LanguageModule,
    WordOfDayModule,
  ],
  providers: [TelegramBotStateService, TelegramBotUpdateService],
})
export class TelegramBotModule {}
