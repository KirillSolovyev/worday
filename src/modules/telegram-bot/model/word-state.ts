import { Context } from 'telegraf';

import { prettyTL } from '@/shared/lib/pretty-tl';
import { UserStateEnum } from '@/entities/user-state';
import { UserService } from '@/services/user-service';
import { WordOfDayService } from '@/features/word-of-day-module';

import { AbstractState } from './abstract-state';
import { TelegramBotCommand } from '../types';

export class WordState extends AbstractState {
  constructor(
    ctx: Context,
    userService: UserService,
    private wordOfDayService: WordOfDayService,
  ) {
    super(ctx, UserStateEnum.WORD, userService);
  }

  async start() {
    await this.ctx.reply(
      `You are all set up! Now text /${TelegramBotCommand.WORD} to get the word of the day`,
    );
  }

  async handle() {
    try {
      this.logger.log('Handling word of the day');

      await this.ctx.reply('Generating word of the day...');

      const user = await this.getUser({ state: true, settings: true, words: true });
      const word = await this.wordOfDayService.getWord(user);

      const formattedExamples = word.examples.map(({ value }) => `- ${value}`).join('\n');
      const formattedMessage = prettyTL(`
        *${word.word}*

        _${word.definition}_

        ${formattedExamples}
      `);

      await this.ctx.reply(formattedMessage, { parse_mode: 'Markdown' });
    } catch (error) {
      this.logger.error('Failed to handle word of the day', error);
      throw new Error('Oops, I could not generate the word of the day. Please try again');
    }
  }
}
