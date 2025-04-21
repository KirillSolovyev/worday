import { Controller, Get, Headers } from '@nestjs/common';
import { WordOfDayService } from './service';

@Controller('word')
export class WordOfDayController {
  constructor(private wordOfDayService: WordOfDayService) {}

  @Get('start')
  start(@Headers('x-user-name') username: string) {
    return this.wordOfDayService.start({ username });
  }

  @Get()
  generateWord(@Headers('x-user-name') username: string) {
    return this.wordOfDayService.getWord({ username });
  }
}
