import { Module } from '@nestjs/common';
import { GeminiModule } from '@/entities/gemini';

import { WordService } from './service';
import { WordController } from './controller';

@Module({
  imports: [GeminiModule],
  providers: [WordService],
  controllers: [WordController],
})
export class WordModule {}
