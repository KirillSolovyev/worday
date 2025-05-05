import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import type { IUser, User } from '@/entities/user';
import { type IUserState, UserStateEnum } from '@/entities/user-state';

export class CreateUserDTO implements Omit<IUser, 'id'> {
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateStateDTO implements Omit<IUserState, 'id'> {
  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  @IsEnum(UserStateEnum)
  currentState: UserStateEnum;
}
