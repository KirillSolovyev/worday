import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository, type FindOptionsWhere, type FindOneOptions } from 'typeorm';

import { User } from '@/entities/user';
import { UserState } from '@/entities/user-state';
import { CreateUserDTO } from './types';
import { UserSettingsService } from '@/entities/user-settings';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserState) private userStateRepository: Repository<UserState>,
    private userSettingsService: UserSettingsService,
  ) {}

  async create({ username, isActive }: CreateUserDTO) {
    const existingUser = await this.userRepository.findOneBy({ username });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = this.userRepository.create({ username, isActive });
    const savedUser = await this.userRepository.save(user);

    const userState = this.userStateRepository.create({ user: savedUser });
    await this.userStateRepository.save(userState);

    await this.userSettingsService.create(user);

    return savedUser;
  }

  findOneBy(findOptions: FindOptionsWhere<User>) {
    return this.userRepository.findOneBy(findOptions);
  }

  findOne(findOptions: FindOneOptions<User>) {
    return this.userRepository.findOne(findOptions);
  }
}
