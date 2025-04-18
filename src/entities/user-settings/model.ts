import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Relation } from 'typeorm';
import { Language } from '@/shared/config/languages';
import { LanguageLevel } from '@/shared/config/language-level';

import { User } from '../user';
import { IUserSettings } from './types';

@Entity()
export class UserSettings implements IUserSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.settings)
  @JoinColumn()
  user: Relation<User>;

  @Column({ default: Language.EN })
  baseLanguage: Language;

  @Column({ default: Language.EN })
  targetLanguage: Language;

  @Column({ default: LanguageLevel.B1 })
  languageLevel: LanguageLevel;

  @Column({ length: 100, default: 'general' })
  topics: string;
}
