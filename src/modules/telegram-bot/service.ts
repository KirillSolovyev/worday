import { Ctx, Start, Update, Command, On, Message } from 'nestjs-telegraf';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { Context } from 'telegraf';

import { GeminiService } from '@/services/gemini';
import { UserService } from '@/services/user-service';
import { WordsService } from '@/services/words-service';
import { LanguageService } from '@/features/language-module';

@Injectable()
@Update()
export class TelegramBotUpdateService {
  private logger = new Logger(TelegramBotUpdateService.name);

  constructor(
    private userService: UserService,
    private geminiService: GeminiService,
    private wordsService: WordsService,
    private languageService: LanguageService,
  ) {}

  private async getUsernameFromContext(ctx: Context): Promise<string | null> {
    const username = ctx.from?.username;

    if (!username) {
      this.logger.error('No username found in context');
      await ctx.reply('It looks like you have not started the bot yet. Try to type /start');
      return null;
    }

    return username;
  }

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const username = await this.getUsernameFromContext(ctx);
    if (!username) return;

    this.logger.log('Starting Telegram bot', username);

    let user = await this.userService.findOne({
      where: { username },
      relations: { settings: true, state: true },
    });

    if (!user) {
      this.logger.log(`User not found, creating new user: ${username}`);
      user = await this.userService.create({ username });
    }

    await ctx.reply('Welcome to the word of the day bot!');
  }

  @Command('settings')
  async onGetSettings(@Ctx() ctx: Context) {
    const username = await this.getUsernameFromContext(ctx);
    if (!username) return;

    const settings = await this.userService.findOne({
      where: { username },
      relations: { settings: true },
    });

    if (!settings) {
      await ctx.reply('Settings not found. Please set it up first: `/settings/create`', {
        parse_mode: 'Markdown',
      });
      return;
    }

    const { targetLanguage, languageLevel, baseLanguage, topics } = settings.settings;
    const message = `
      **Your settings:**
      - Study language: ${targetLanguage}
      - Base language: ${baseLanguage}
      - Language level: ${languageLevel}
      - Topics: ${topics}
    `;

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  // TODO: Implement a state machine for settings
  @On('text')
  async onText(@Ctx() ctx: Context, @Message('text') message: string) {
    const username = await this.getUsernameFromContext(ctx);
    if (!username) return;

    try {
      const language = await this.languageService.getLanguageFromPrompt({ userPrompt: message });
      await ctx.reply(`The language set to: ${language}`);
    } catch (error) {
      this.logger.error('Error while getting language', error);
      if (error instanceof NotFoundException) {
        await ctx.reply('Language not found. Please try again.');
        return;
      }

      await ctx.reply("I couldn't get you. Please try again.");
    }
  }
}
