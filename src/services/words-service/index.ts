import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Word } from '@/entities/word';
import { WordExamples } from '@/entities/word-examples';
import { WordsService } from './service';

export { WordsService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([Word]), TypeOrmModule.forFeature([WordExamples])],
  exports: [WordsService],
  providers: [WordsService],
})
export class WordsModule {}
