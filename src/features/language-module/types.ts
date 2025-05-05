import { Language } from '@/shared/config/languages';
import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

export class GetLanguageDTO {
  @IsNotEmpty()
  @MaxLength(50)
  userPrompt: string;
}

export class ParsedLanguage {
  @IsNotEmpty()
  @IsEnum(Language)
  language: Language;
}

export class LanguageNotFoundError extends Error {}
