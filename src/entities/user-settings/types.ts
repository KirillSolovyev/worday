import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

import { Language } from '@/shared/config/languages';
import { LanguageLevel } from '@/shared/config/language-level';
import type { IUser } from '../user';

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

export interface IUserSettings {
  id: string;
  user: IUser;
  topics: string;
  baseLanguage: Language;
  targetLanguage: Language;
  languageLevel: LanguageLevel;
}
