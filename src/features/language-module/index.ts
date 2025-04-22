import { Module } from '@nestjs/common';
import { GeminiModule } from '@/services/gemini';
import { LanguageService } from './service';

export { LanguageService } from './service';

@Module({
  imports: [GeminiModule],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
