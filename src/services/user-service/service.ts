import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository, type FindOptionsWhere, type FindOneOptions } from 'typeorm';

import { User } from '@/entities/user';
import { UserState } from '@/entities/user-state';
import { UserSettingsService } from '../user-settings-service';
import { CreateUserDTO, UpdateStateDTO } from './types';

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
    user.state = this.userStateRepository.create();
    const savedUser = await this.userRepository.save(user);

    await this.userSettingsService.create(user);

    return savedUser;
  }

  findOneBy(findOptions: FindOptionsWhere<User>) {
    return this.userRepository.findOneBy(findOptions);
  }

  findOne(findOptions: FindOneOptions<User>) {
    return this.userRepository.findOne(findOptions);
  }

  async updateState({ user, currentState }: UpdateStateDTO) {
    if (!user.state) {
      throw new BadRequestException('User does not have a state');
    }

    const existingUserState = await this.userStateRepository.findOneBy({ id: user.state.id });
    if (!existingUserState) {
      throw new BadRequestException('User state not found');
    }

    return this.userStateRepository.save({
      ...existingUserState,
      currentState: currentState,
    });
  }
}
