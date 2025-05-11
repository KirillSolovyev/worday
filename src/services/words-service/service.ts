import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { User } from '@/entities/user';
import { Word } from '@/entities/word';
import { WordExamples } from '@/entities/word-examples';
import { CreateWordDTO } from './types';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word) private wordRepository: Repository<Word>,
    @InjectRepository(WordExamples) private wordExamplesRepository: Repository<WordExamples>,
  ) {}

  createExample(value: string) {
    return this.wordExamplesRepository.create({ value });
  }

  createWord(user: User, word: CreateWordDTO) {
    const examples = word.examples.map(example => this.createExample(example));

    const wordEntity = this.wordRepository.create({
      user,
      word: word.word,
      definition: word.definition,
      examples,
    });

    return this.wordRepository.save(wordEntity);
  }

  find(user: User, options: FindManyOptions<Word>) {
    return this.wordRepository.find({
      where: { user: { id: user.id } },
      ...options,
    });
  }
}
