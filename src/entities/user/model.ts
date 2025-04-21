import { Entity, Column, PrimaryGeneratedColumn, OneToOne, Relation, OneToMany } from 'typeorm';

import { IUser } from './types';
import { UserSettings } from '../user-settings';
import { Word } from '../word';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => UserSettings, settings => settings.user, { cascade: true })
  settings: Relation<UserSettings>;

  @OneToMany(() => Word, word => word.user)
  words: Relation<Word[]>;
}
