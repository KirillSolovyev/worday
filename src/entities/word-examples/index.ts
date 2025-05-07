import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Word } from '../word';

export interface IWordExamples {
  value: string;
}

@Entity()
export class WordExamples implements IWordExamples {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Word, word => word.examples, { onDelete: 'CASCADE' })
  word: Relation<Word>;

  @Column({ nullable: false })
  value: string;
}
