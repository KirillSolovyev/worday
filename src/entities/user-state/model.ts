import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from '../user';
import { UserStateEnum } from './types';

@Entity()
export class UserState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.state, { cascade: true })
  @JoinColumn()
  user: Relation<User>;

  @Column({ nullable: false, default: UserStateEnum.INIT })
  currentState: UserStateEnum;
}
