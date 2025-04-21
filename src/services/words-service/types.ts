import type { IWord } from '@/entities/word';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateWordDTO implements Omit<IWord, 'id'> {
  @IsNotEmpty()
  @IsString()
  word: string;

  @IsNotEmpty()
  @IsString()
  definition: string;

  @IsNotEmpty()
  @IsArray()
  examples: string[];
}
