import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from '../user';
import { WordExamples } from '../word-examples';

export interface IWord {
  id: string;
  word: string;
  definition: string;
}

@Entity()
export class Word implements IWord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  word: string;

  @Column({ nullable: false })
  definition: string;

  @ManyToOne(() => User, user => user.words, { onDelete: 'CASCADE' })
  user: Relation<User>;

  @OneToMany(() => WordExamples, example => example.word, { cascade: true })
  examples: Relation<WordExamples[]>;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
