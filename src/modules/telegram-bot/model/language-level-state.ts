import { Context } from 'telegraf';

import { UserStateEnum } from '@/entities/user-state';
import { UserService } from '@/services/user-service';
import { UserSettingsService } from '@/services/user-settings-service';
import { LanguageLevel } from '@/shared/config/language-level';

import { AbstractState } from './abstract-state';

export class LanguageLevelState extends AbstractState {
  constructor(
    ctx: Context,
    state: UserStateEnum,
    private nextState: UserStateEnum,
    userService: UserService,
    private userSettingsService: UserSettingsService,
  ) {
    super(ctx, state, userService);
  }

  async start() {
    await this.ctx.reply(
      'Please, choose how good you are at the language. The higher the level the more difficult words I will generate',
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Beginner, A1', callback_data: LanguageLevel.A1 },
              { text: 'Elementary, A2', callback_data: LanguageLevel.A2 },
            ],
            [
              { text: 'Intermediate, B1', callback_data: LanguageLevel.B1 },
              { text: 'Upper-Intermediate, B2', callback_data: LanguageLevel.B2 },
            ],
            [
              { text: 'Advanced, C1', callback_data: LanguageLevel.C1 },
              { text: 'Proficient, C2', callback_data: LanguageLevel.C2 },
            ],
          ],
        },
      },
    );
  }

  async handle() {
    try {
      this.logger.log('Handling language level selection');

      if (!this.ctx.callbackQuery || !('data' in this.ctx.callbackQuery)) {
        throw new Error('Please choose the language level among the options');
      }

      const user = await this.getUser();
      await this.userSettingsService.update(user, user.settings.id, {
        ...user.settings,
        languageLevel: this.ctx.callbackQuery.data as LanguageLevel,
      });

      await this.userService.updateState({
        user,
        currentState: this.nextState,
      });

      await this.ctx.reply(
        `Your language level is set to ${this.ctx.callbackQuery.data}. You can change it later with the /level command.`,
      );
    } catch (error) {
      this.logger.error('Failed to handle language level selection', error);
      throw error;
    }
  }
}
