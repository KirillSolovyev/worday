import { Context } from 'telegraf';

import { UserStateEnum } from '@/entities/user-state';
import { UserService } from '@/services/user-service';
import { UserSettingsService } from '@/services/user-settings-service';

import { AbstractState } from './abstract-state';
import { TelegramBotCommand } from '../types';

export class TopicsState extends AbstractState {
  constructor(
    ctx: Context,
    userService: UserService,
    private userSettingsService: UserSettingsService,
  ) {
    super(ctx, UserStateEnum.INIT_TARGET_LANGUAGE, userService);
  }

  async start() {
    await this.ctx.reply(
      'Please text the topics you want to learn new words about. It should be simple and precise. For example: "I want to learn words about university, study and classes"',
    );
  }

  async handle() {
    try {
      this.logger.log('Handling topics selection');

      const message = this.getMessage();
      const user = await this.getUser();

      await this.userSettingsService.update(user, user.settings.id, {
        ...user.settings,
        topics: message,
      });

      await this.userService.updateState({
        user,
        currentState: UserStateEnum.WORD,
      });

      await this.ctx.reply(
        `Great we setup your topic. You can change it later with the /${TelegramBotCommand.TOPICS} command.`,
      );
    } catch (error) {
      this.logger.error('Failed to handle topics selection', error);
      throw error;
    }
  }
}
