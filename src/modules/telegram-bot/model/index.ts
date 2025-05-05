import { Injectable } from '@nestjs/common';
import type { Context } from 'telegraf';

import { UserStateEnum } from '@/entities/user-state';
import { UserService } from '@/services/user-service';
import { LanguageService } from '@/features/language-module';
import { UserSettingsService } from '@/services/user-settings-service';
import { WordOfDayService } from '@/features/word-of-day-module';

import { StartState } from './start-state';
import { InitBaseLanguageState, InitTargetLanguageState } from './language-state';
import { LanguageLevelState } from './language-level-state';
import { TopicsState } from './topics-state';
import { WordState } from './word-state';
import type { AbstractState } from './abstract-state';

@Injectable()
export class TelegramBotStateService {
  constructor(
    private userService: UserService,
    private languageService: LanguageService,
    private userSettingsService: UserSettingsService,
    private wordOfDayService: WordOfDayService,
  ) {}

  getState(ctx: Context, state: UserStateEnum): AbstractState {
    switch (state) {
      case UserStateEnum.INIT:
        return new StartState(ctx, this.userService);
      case UserStateEnum.INIT_BASE_LANGUAGE:
        return new InitBaseLanguageState(
          ctx,
          this.userService,
          this.languageService,
          this.userSettingsService,
        );
      case UserStateEnum.INIT_TARGET_LANGUAGE:
        return new InitTargetLanguageState(
          ctx,
          this.userService,
          this.languageService,
          this.userSettingsService,
        );
      case UserStateEnum.INIT_LANGUAGE_LEVEL:
        return new LanguageLevelState(
          ctx,
          UserStateEnum.INIT_LANGUAGE_LEVEL,
          UserStateEnum.INIT_TOPICS,
          this.userService,
          this.userSettingsService,
        );
      case UserStateEnum.INIT_TOPICS:
        return new TopicsState(ctx, this.userService, this.userSettingsService);
      case UserStateEnum.WORD:
        return new WordState(ctx, this.userService, this.wordOfDayService);
      default:
        return new WordState(ctx, this.userService, this.wordOfDayService);
    }
  }

  getNextState(ctx: Context, state: UserStateEnum): AbstractState {
    switch (state) {
      case UserStateEnum.INIT:
        return new InitBaseLanguageState(
          ctx,
          this.userService,
          this.languageService,
          this.userSettingsService,
        );
      case UserStateEnum.INIT_BASE_LANGUAGE:
        return new InitTargetLanguageState(
          ctx,
          this.userService,
          this.languageService,
          this.userSettingsService,
        );
      case UserStateEnum.INIT_TARGET_LANGUAGE:
        return new LanguageLevelState(
          ctx,
          UserStateEnum.INIT_LANGUAGE_LEVEL,
          UserStateEnum.INIT_TOPICS,
          this.userService,
          this.userSettingsService,
        );
      case UserStateEnum.INIT_LANGUAGE_LEVEL:
        return new TopicsState(ctx, this.userService, this.userSettingsService);
      case UserStateEnum.INIT_TOPICS:
        return new WordState(ctx, this.userService, this.wordOfDayService);
      case UserStateEnum.WORD:
        return new WordState(ctx, this.userService, this.wordOfDayService);
      default:
        return new WordState(ctx, this.userService, this.wordOfDayService);
    }
  }
}
