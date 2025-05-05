import { Language } from '@/shared/config/languages';
import { LanguageLevel } from '@/shared/config/language-level';
import type { IUser } from '../user';

export interface IUserSettings {
  id: string;
  user: IUser;
  topics: string;
  baseLanguage: Language;
  targetLanguage: Language;
  languageLevel: LanguageLevel;
}
