import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@/entities/user';
import { UserSettings } from '@/entities/user-settings';
import { CreateUserSettingsDTO } from './types';

@Injectable()
export class UserSettingsService {
  private readonly logger = new Logger(UserSettingsService.name);

  constructor(
    @InjectRepository(UserSettings)
    private userSettingsRepository: Repository<UserSettings>,
  ) {}

  async create(user: User) {
    this.logger.log(`Setting user settings for user: ${user.id}`);

    const userSettings = this.userSettingsRepository.create({ user });
    const savedUserSettings = await this.userSettingsRepository.save(userSettings);
    this.logger.log(`User settings saved successfully`);

    return savedUserSettings;
  }

  async update(user: User, settingsId: string, userSettings: CreateUserSettingsDTO) {
    this.logger.log(`Updating user settings: ${settingsId}`);

    if (user.settings.id !== settingsId) {
      this.logger.error(`User settings ID does not match user settings`);
      throw new BadRequestException('User settings ID does not match user settings');
    }

    const existingSettings = await this.userSettingsRepository.findOneBy({ id: settingsId });
    if (!existingSettings) {
      throw new NotFoundException('User settings not found');
    }

    const updatedUserSettings = await this.userSettingsRepository.save({
      ...existingSettings,
      ...userSettings,
    });

    this.logger.log(`User settings updated successfully`);
    return updatedUserSettings;
  }
}
