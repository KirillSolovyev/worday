import { Context } from 'telegraf';

import { getVerbalLanguage, Language } from '@/shared/config/languages';
import { UserStateEnum } from '@/entities/user-state';
import type { UserSettings } from '@/entities/user-settings';
import { UserService } from '@/services/user-service';
import { UserSettingsService } from '@/services/user-settings-service';
import { LanguageNotFoundError, LanguageService } from '@/features/language-module';

import { AbstractState, NoMessageError } from './abstract-state';
import { TelegramBotCommand } from '../types';

type HandleLanguageProps = {
  nextState: UserStateEnum;
  buildMessage: (language: Language) => string;
  deriveUserSettings: (userSettings: UserSettings, language: Language) => UserSettings;
};

abstract class BaseLanguageState extends AbstractState {
  constructor(
    ctx: Context,
    state: UserStateEnum,
    userService: UserService,
    private languageService: LanguageService,
    private userSettingsService: UserSettingsService,
  ) {
    super(ctx, state, userService);
  }

  async start(message: string) {
    await this.ctx.reply(message);
  }

  async handle({ nextState, buildMessage, deriveUserSettings }: HandleLanguageProps) {
    try {
      this.logger.log('Start handling a language');

      const message = this.getMessage();
      const user = await this.getUser();
      const language = await this.languageService.getLanguageFromPrompt({ userPrompt: message });

      await this.userSettingsService.update(
        user,
        user.settings.id,
        deriveUserSettings(user.settings, language),
      );

      await this.userService.updateState({
        user,
        currentState: nextState,
      });

      await this.ctx.reply(buildMessage(language), { parse_mode: 'Markdown' });
    } catch (error) {
      this.logger.error('Failed to handle a language');

      if (error instanceof NoMessageError) {
        throw new Error('Sorry, I did not understand you. Please text the language you speak');
      } else if (error instanceof LanguageNotFoundError) {
        throw new Error("Sorry, I don't support this language yet. Please choose another one");
      }

      throw new Error('Oops, I could not handle your request. Please try again');
    }
  }
}

export class InitBaseLanguageState extends BaseLanguageState {
  constructor(
    ctx: Context,
    userService: UserService,
    languageService: LanguageService,
    userSettingsService: UserSettingsService,
  ) {
    super(ctx, UserStateEnum.INIT_BASE_LANGUAGE, userService, languageService, userSettingsService);
  }

  async start() {
    await super.start(
      'Please text the language you speak. I will use it to explain meanings of the words. For example: "English"',
    );
  }

  async handle() {
    await super.handle({
      nextState: UserStateEnum.INIT_TARGET_LANGUAGE,
      buildMessage: language =>
        `Great! Your language is set to \`${getVerbalLanguage(language)}\`. You can change it later with the /${TelegramBotCommand.BASE_LANGUAGE} command.`,
      deriveUserSettings: (userSettings, language) => ({
        ...userSettings,
        baseLanguage: language,
      }),
    });
  }
}

export class ChangeBaseLanguageState extends BaseLanguageState {
  constructor(
    ctx: Context,
    userService: UserService,
    languageService: LanguageService,
    userSettingsService: UserSettingsService,
  ) {
    super(
      ctx,
      UserStateEnum.SETTINGS_BASE_LANGUAGE,
      userService,
      languageService,
      userSettingsService,
    );
  }

  async start() {
    await super.start(
      'Please text the language you speak. I will use it to explain meanings of the words. For example: "English"',
    );
  }

  async handle() {
    await super.handle({
      nextState: UserStateEnum.WORD,
      buildMessage: language =>
        `Great! Your language is set to \`${getVerbalLanguage(language)}\`. You can change it later with the /${TelegramBotCommand.BASE_LANGUAGE} command.`,
      deriveUserSettings: (userSettings, language) => ({
        ...userSettings,
        baseLanguage: language,
      }),
    });
  }
}

export class InitTargetLanguageState extends BaseLanguageState {
  constructor(
    ctx: Context,
    userService: UserService,
    languageService: LanguageService,
    userSettingsService: UserSettingsService,
  ) {
    super(
      ctx,
      UserStateEnum.INIT_TARGET_LANGUAGE,
      userService,
      languageService,
      userSettingsService,
    );
  }

  async start() {
    await super.start(
      'Please text the language you want to study. I will use it to generate the word of the day',
    );
  }

  async handle() {
    await super.handle({
      nextState: UserStateEnum.INIT_LANGUAGE_LEVEL,
      buildMessage: language =>
        `Great! Your study language is set to \`${getVerbalLanguage(language)}\`. You can change it later with the /${TelegramBotCommand.TARGET_LANGUAGE} command.`,
      deriveUserSettings: (userSettings, language) => ({
        ...userSettings,
        targetLanguage: language,
      }),
    });
  }
}

export class ChangeTargetLanguageState extends BaseLanguageState {
  constructor(
    ctx: Context,
    userService: UserService,
    languageService: LanguageService,
    userSettingsService: UserSettingsService,
  ) {
    super(
      ctx,
      UserStateEnum.SETTINGS_TARGET_LANGUAGE,
      userService,
      languageService,
      userSettingsService,
    );
  }

  async start() {
    await super.start(
      'Please text the language you want to study. I will use it to generate the word of the day',
    );
  }

  async handle() {
    await super.handle({
      nextState: UserStateEnum.WORD,
      buildMessage: language =>
        `Great! Your study language is set to \`${getVerbalLanguage(language)}\`. You can change it later with the /${TelegramBotCommand.TARGET_LANGUAGE} command.`,
      deriveUserSettings: (userSettings, language) => ({
        ...userSettings,
        targetLanguage: language,
      }),
    });
  }
}
