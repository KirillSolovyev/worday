import { Module } from '@nestjs/common';

import { GeminiModule } from '@/services/gemini';
import { WordsModule } from '@/services/words-service';

import { WordOfDayService } from './service';

export { WordOfDayService, WordOfDayTimeLimitError } from './service';

@Module({
  imports: [GeminiModule, WordsModule],
  providers: [WordOfDayService],
  exports: [WordOfDayService],
})
export class WordOfDayModule {}
