import { Controller, Get } from '@nestjs/common';
import { WordService } from './service';

@Controller('word')
export class WordController {
  constructor(private wordService: WordService) {}

  @Get()
  async getWord() {
    return this.wordService.getWord();
  }
}
