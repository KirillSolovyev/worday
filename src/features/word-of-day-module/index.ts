import { Module } from '@nestjs/common';

import { GeminiModule } from '@/services/gemini';
import { WordsModule } from '@/services/words-service';

import { WordOfDayService } from './service';

@Module({
  imports: [GeminiModule, WordsModule],
  providers: [WordOfDayService],
})
export class WordOfDayModule {}
