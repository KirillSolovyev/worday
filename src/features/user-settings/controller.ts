import {
  Headers,
  Body,
  Controller,
  Post,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { UserService } from '@/services/user-service';
import { UserSettingsService } from './service';
import { CreateUserSettingsDTO } from './types';

@Controller('user/settings')
export class UserSettingsController {
  constructor(
    private userSettingsService: UserSettingsService,
    private userService: UserService,
  ) {}

  @Post()
  async createUserSettings(
    // TODO: Add headers validation. @see https://stackoverflow.com/questions/66911356/create-a-header-custom-validation-with-nestjs-and-class-validator https://www.youtube.com/watch?v=NlQFSgvTaFw
    @Headers('x-user-name') username: string,
    @Body() settings: CreateUserSettingsDTO,
  ) {
    if (!username) {
      throw new BadRequestException('Username is required');
    }

    // TODO: Implement proper sessions, so we don't need to fetch user in every request
    const user = await this.userService.findWithSettings({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.settings) {
      throw new BadRequestException('User settings already exist');
    }

    return this.userSettingsService.create(user, settings);
  }

  @Post(':id')
  async updateUserSettings(
    @Headers('x-user-name') username: string,
    @Param('id') id: string,
    @Body() settings: CreateUserSettingsDTO,
  ) {
    if (!username) {
      throw new BadRequestException('Username is required');
    }

    const user = await this.userService.findWithSettings({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.settings) {
      throw new NotFoundException('User settings not found');
    }

    return this.userSettingsService.update(user, id, settings);
  }
}
