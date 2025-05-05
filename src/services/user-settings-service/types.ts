import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

import { IUserSettings } from '@/entities/user-settings';
import { Language } from '@/shared/config/languages';
import { LanguageLevel } from '@/shared/config/language-level';

export class CreateUserSettingsDTO implements Omit<IUserSettings, 'id' | 'user'> {
  @IsNotEmpty()
  @IsEnum(Language)
  baseLanguage: Language;

  @IsNotEmpty()
  @IsEnum(Language)
  targetLanguage: Language;

  @IsNotEmpty()
  @IsEnum(LanguageLevel)
  languageLevel: LanguageLevel;

  @IsNotEmpty()
  @MaxLength(100)
  topics: string;
}
