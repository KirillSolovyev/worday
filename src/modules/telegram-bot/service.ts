import { Ctx, Start, Command, Update, On, InjectBot } from 'nestjs-telegraf';
import { Injectable, Logger, NotFoundException, type OnModuleInit } from '@nestjs/common';
import type { Telegraf, Context } from 'telegraf';

import { UserStateEnum } from '@/entities/user-state';
import { UserService } from '@/services/user-service';

import { prettyTL } from '@/shared/lib/pretty-tl';
import { TelegramBotStateService } from './model';
import { TelegramBotCommand } from './types';

@Injectable()
@Update()
export class TelegramBotUpdateService implements OnModuleInit {
  private logger = new Logger(TelegramBotUpdateService.name);

  constructor(
    @InjectBot() private bot: Telegraf,
    private userService: UserService,
    private telegramBotStateService: TelegramBotStateService,
  ) {}

  async onModuleInit() {
    await this.bot.telegram.setMyCommands([
      { command: TelegramBotCommand.WORD, description: 'Get a word of the day' },
      { command: TelegramBotCommand.SETTINGS, description: 'Display your study settings' },
      { command: TelegramBotCommand.BASE_LANGUAGE, description: 'Change your language' },
      { command: TelegramBotCommand.TARGET_LANGUAGE, description: 'Change study language' },
      { command: TelegramBotCommand.LANGUAGE_LEVEL, description: 'Change language level' },
      { command: TelegramBotCommand.TOPICS, description: 'Change topics' },
      { command: TelegramBotCommand.START, description: 'Start the bot' },
      { command: TelegramBotCommand.CANCEL, description: 'Cancel previous command' },
    ]);
  }

  private async getUsernameFromContext(ctx: Context) {
    const username = ctx.from?.id;

    if (!username) {
      this.logger.error('No username found in context');
      await ctx.reply(
        `It looks like you have not started the bot yet. Try to type /${TelegramBotCommand.START}`,
      );
      return;
    }

    return String(username);
  }

  private async getUserFromContext(ctx: Context) {
    const username = await this.getUsernameFromContext(ctx);
    if (!username) return;

    const user = await this.userService.findOne({
      where: { username },
      relations: { settings: true, state: true },
    });

    if (!user) {
      await ctx.reply(`User not found. Please start the bot first: /${TelegramBotCommand.START}`);
      return;
    }

    return user;
  }

  private isUserInitPending(userState: UserStateEnum) {
    return [
      UserStateEnum.INIT,
      UserStateEnum.INIT_BASE_LANGUAGE,
      UserStateEnum.INIT_TARGET_LANGUAGE,
      UserStateEnum.INIT_LANGUAGE_LEVEL,
      UserStateEnum.INIT_TOPICS,
    ].includes(userState);
  }

  private async onSettingsChange(ctx: Context, currentState: UserStateEnum) {
    const user = await this.getUserFromContext(ctx);
    if (!user) return;

    const isUserInitPending = this.isUserInitPending(user.state.currentState);
    const botCurrentState = isUserInitPending ? user.state.currentState : currentState;
    const botState = this.telegramBotStateService.getState(ctx, botCurrentState);

    if (isUserInitPending) {
      await ctx.reply('Please finish the bot setup first');
    } else {
      await this.userService.updateState({
        user,
        currentState,
      });
    }

    await botState.start();
    await ctx.reply(
      `Text /${TelegramBotCommand.CANCEL} if you changed your mind or just wanted to look at the options`,
    );
  }

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const botState = this.telegramBotStateService.getState(ctx, UserStateEnum.INIT);

    try {
      await botState.start();
      await botState.handle();

      const user = await this.getUserFromContext(ctx);
      if (!user) {
        throw new Error('User not found after starting the bot');
      }

      const nextBotState = this.telegramBotStateService.getNextState(ctx, user.state.currentState);
      await nextBotState.start();
    } catch (error) {
      this.logger.error('Error while starting bot', error);

      if (error instanceof NotFoundException) {
        await ctx.reply(
          `It looks like you have not started the bot yet. Try to type /${TelegramBotCommand.START}`,
          {
            parse_mode: 'Markdown',
          },
        );
      } else {
        await ctx.reply('Oops, I could not handle your request. Please try again');
      }
    }
  }

  @Command(TelegramBotCommand.WORD)
  async onGetWord(@Ctx() ctx: Context) {
    const user = await this.getUserFromContext(ctx);
    if (!user) return;

    const isReadyToGenerateWord = user.state.currentState === UserStateEnum.WORD;
    const botCurrentState = isReadyToGenerateWord ? UserStateEnum.WORD : user.state.currentState;
    const botState = this.telegramBotStateService.getState(ctx, botCurrentState);

    try {
      if (isReadyToGenerateWord) {
        await botState.handle();
      } else {
        await ctx.reply(
          'It looks like you have not finished the setup yet. Please finish it first',
        );
        await botState.start();
      }
    } catch (error) {
      this.logger.error('Error while generating the word', error);
      await ctx.reply('Oops, I could not generate a word. Please try again');
    }
  }

  @Command(TelegramBotCommand.SETTINGS)
  async onGetSettings(@Ctx() ctx: Context) {
    const username = await this.getUsernameFromContext(ctx);
    if (!username) return;

    const settings = await this.userService.findOne({
      where: { username },
      relations: { settings: true },
    });

    if (!settings) {
      await ctx.reply(
        `Oops, I could not find your settings. Please try to start the bot again /${TelegramBotCommand.START}`,
      );
      return;
    }

    const { targetLanguage, languageLevel, baseLanguage, topics } = settings.settings;
    const message = prettyTL(`
      *Study language:*
      \`${targetLanguage}\`
      Text /${TelegramBotCommand.TARGET_LANGUAGE} to change it

      *Base language:*
      \`${baseLanguage}\`
      Text /${TelegramBotCommand.BASE_LANGUAGE} to change it 

      *Language level:*
      \`${languageLevel}\`
      Text /${TelegramBotCommand.LANGUAGE_LEVEL} to change it

      *Topics:*
      \`${topics}\`
      Text to change it /${TelegramBotCommand.TOPICS}

      You can change your settings at any time. Just text me the command
    `);

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  @Command(TelegramBotCommand.BASE_LANGUAGE)
  async onBaseLanguageChange(@Ctx() ctx: Context) {
    await this.onSettingsChange(ctx, UserStateEnum.SETTINGS_BASE_LANGUAGE);
  }

  @Command(TelegramBotCommand.TARGET_LANGUAGE)
  async onTargetLanguageChange(@Ctx() ctx: Context) {
    await this.onSettingsChange(ctx, UserStateEnum.SETTINGS_TARGET_LANGUAGE);
  }

  @Command(TelegramBotCommand.LANGUAGE_LEVEL)
  async onLanguageLevelChange(@Ctx() ctx: Context) {
    await this.onSettingsChange(ctx, UserStateEnum.SETTINGS_LANGUAGE_LEVEL);
  }

  @Command(TelegramBotCommand.TOPICS)
  async onTopicsChange(@Ctx() ctx: Context) {
    await this.onSettingsChange(ctx, UserStateEnum.SETTINGS_TOPICS);
  }

  @Command(TelegramBotCommand.CANCEL)
  async onCancel(@Ctx() ctx: Context) {
    const user = await this.getUserFromContext(ctx);
    if (!user) return;

    const isUserInitPending = this.isUserInitPending(user.state.currentState);
    if (isUserInitPending) {
      await ctx.reply("You can't cancel the setup process. Please finish it first");
      return;
    }

    const botState = this.telegramBotStateService.getState(ctx, UserStateEnum.WORD);

    try {
      await this.userService.updateState({
        user,
        currentState: UserStateEnum.WORD,
      });

      await botState.start();
    } catch (error) {
      this.logger.error('Error while canceling the process', error);
      await ctx.reply('Oops, I could not cancel the process. Please try again');
    }
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    const user = await this.getUserFromContext(ctx);
    if (!user) return;

    if (user.state.currentState === UserStateEnum.WORD) {
      await ctx.reply(`To generate a new word, please type /${TelegramBotCommand.WORD}`);
      return;
    }

    const botState = this.telegramBotStateService.getState(ctx, user.state.currentState);
    try {
      await botState.handle();

      const nextBotState = this.telegramBotStateService.getNextState(ctx, user.state.currentState);
      await nextBotState.start();
    } catch (error) {
      if (error instanceof Error) {
        await ctx.reply(error.message);
      } else {
        await ctx.reply('Oops, I could not process your request. Please try again.');
      }
    }
  }

  @On('callback_query')
  async onCallbackQuery(@Ctx() ctx: Context) {
    const user = await this.getUserFromContext(ctx);
    if (!user) return;

    if (
      ![UserStateEnum.INIT_LANGUAGE_LEVEL, UserStateEnum.SETTINGS_LANGUAGE_LEVEL].includes(
        user.state.currentState,
      )
    ) {
      await ctx.reply(
        `The language level is already set to ${user.settings.languageLevel}. If you want to change it, text /${TelegramBotCommand.LANGUAGE_LEVEL}`,
      );
      return;
    }

    const botState = this.telegramBotStateService.getState(ctx, user.state.currentState);
    try {
      await botState.handle();

      const nextBotState = this.telegramBotStateService.getNextState(ctx, user.state.currentState);
      await nextBotState.start();
    } catch (error) {
      if (error instanceof Error) {
        await ctx.reply(error.message);
      } else {
        await ctx.reply('Oops, I could not process your request. Please try again.');
      }
    }
  }
}
