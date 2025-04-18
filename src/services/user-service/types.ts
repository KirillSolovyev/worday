import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import type { IUser } from '@/entities/user';

export class CreateUserDTO implements Omit<IUser, 'id'> {
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
