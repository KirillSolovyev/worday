import { Module } from '@nestjs/common';

import { GeminiModule } from '@/services/gemini';
import { UserModule } from '@/services/user-service';
import { WordsModule } from '@/services/words-service';

import { WordOfDayService } from './service';
import { WordOfDayController } from './controller';

@Module({
  imports: [GeminiModule, UserModule, WordsModule],
  providers: [WordOfDayService],
  controllers: [WordOfDayController],
})
export class WordOfDayModule {}
