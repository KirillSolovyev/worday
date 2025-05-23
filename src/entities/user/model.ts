import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  Relation,
  OneToMany,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { IUser } from './types';
import { UserSettings } from '../user-settings';
import { Word } from '../word';
import { UserState } from '../user-state';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true })
  username: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => UserSettings, settings => settings.user, { cascade: true })
  settings: Relation<UserSettings>;

  @OneToMany(() => Word, word => word.user, { cascade: true })
  words: Relation<Word[]>;

  @OneToOne(() => UserState, userState => userState.user, { cascade: true })
  state: Relation<UserState>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
