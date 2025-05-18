import { Context } from 'telegraf';

import { prettyTL } from '@/shared/lib/pretty-tl';
import { UserStateEnum } from '@/entities/user-state';
import { UserService } from '@/services/user-service';
import { WordOfDayService, WordOfDayTimeLimitError } from '@/features/word-of-day-module';
import type { User } from '@/entities/user';
import type { Word } from '@/entities/word';

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
      `You are ready! Now text /${TelegramBotCommand.WORD} to get the word of the day`,
    );
  }

  async handle() {
    try {
      this.logger.log('Handling word of the day');
      const user = await this.getUser();

      await this.generateWord(user);
    } catch (error) {
      this.logger.error('Failed to handle word of the day', error);
      throw new Error('Oops, I could not generate the word of the day. Please try again');
    }
  }

  private buildMessage(word: Word) {
    const formattedExamples = word.examples.map(({ value }) => `- ${value}`).join('\n\n');
    const formattedMessage = prettyTL(`
        *${word.word}*

        _${word.definition}_

        ${formattedExamples}
      `);
    return formattedMessage;
  }

  private async generateWord(user: User) {
    try {
      await this.ctx.reply('Generating word of the day...');

      const word = await this.wordOfDayService.generateWord(user);
      const formattedMessage = this.buildMessage(word);

      await this.ctx.reply(formattedMessage, { parse_mode: 'Markdown' });
    } catch (error) {
      if (error instanceof WordOfDayTimeLimitError) {
        await this.getLastWord(user);
      } else {
        throw error;
      }
    }
  }

  private async getLastWord(user: User) {
    const lastWord = await this.wordOfDayService.getLastWord(user);
    const formattedMessage = this.buildMessage(lastWord);

    const formattedErrorMsg = prettyTL(`
      You have already received the word of the day today. Please try tomorrow
      
      As for now you can repeat the last word:
      ${formattedMessage}
    `);
    await this.ctx.reply(formattedErrorMsg, { parse_mode: 'Markdown' });
  }
}
