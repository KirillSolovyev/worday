import { Context } from 'telegraf';

import { UserService } from '@/services/user-service';
import { UserStateEnum } from '@/entities/user-state';
import { AbstractState } from './abstract-state';

export class StartState extends AbstractState {
  constructor(ctx: Context, userService: UserService) {
    super(ctx, UserStateEnum.INIT, userService);
  }

  async start() {
    this.logger.log('Starting Telegram bot', this.ctx.from?.username);
    await this.ctx.reply(
      'Welcome to the word of the day bot! I will help you to learn a new word every day',
    );
  }

  async handle() {
    const username = this.getUserName();

    const user = await this.userService.findOne({
      where: { username },
      relations: { state: true },
    });

    if (!user) {
      this.logger.log(`User not found, creating new user: ${username}`);

      const newUser = await this.userService.create({ username });
      await this.userService.updateState({
        user: newUser,
        currentState: UserStateEnum.INIT_BASE_LANGUAGE,
      });

      await this.ctx.reply(
        'To generate the word of the day I need to know your preferences. Please set them up',
      );
    } else {
      await this.ctx.reply(`Welcome back!`);
    }
  }
}
