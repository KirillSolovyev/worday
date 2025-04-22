import { Module } from '@nestjs/common';

import { GeminiModule } from '@/services/gemini';
import { UserModule } from '@/services/user-service';
import { WordsModule } from '@/services/words-service';
import { LanguageModule } from '@/features/language-module';

import { TelegramBotUpdateService } from './service';

@Module({
  imports: [GeminiModule, UserModule, WordsModule, LanguageModule],
  providers: [TelegramBotUpdateService],
})
export class TelegramBotModule {}
