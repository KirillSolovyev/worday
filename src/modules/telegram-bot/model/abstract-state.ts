import { Logger } from '@nestjs/common';
import type { Context } from 'telegraf';

import { UserStateEnum } from '@/entities/user-state';
import { UserService } from '@/services/user-service';

export class NoUserError extends Error {}
export class NoMessageError extends Error {}
export class NoUsernameError extends Error {}

type UserRelations = {
  state: boolean;
  settings: boolean;
  words?: boolean;
};

export abstract class AbstractState {
  ctx: Context;
  state: UserStateEnum;
  userService: UserService;
  logger: Logger;

  constructor(ctx: Context, state: UserStateEnum, userService: UserService) {
    this.ctx = ctx;
    this.state = state;
    this.logger = new Logger(`TelegramBotStateService:${state}`);
    this.userService = userService;
  }

  getUserName() {
    if (!this.ctx.from?.username) {
      throw new NoUserError('No username found in context');
    }

    return this.ctx.from.username;
  }

  // TODO: Get user as a prop instead of fetching it twice, since we must fetch it before initializing the state
  async getUser(relations: UserRelations = { state: true, settings: true }) {
    const username = this.getUserName();

    const user = await this.userService.findOne({
      where: { username },
      relations,
    });

    if (!user) {
      throw new NoUsernameError('User not found');
    }

    return user;
  }

  getMessage() {
    if (!this.ctx.message || !('text' in this.ctx.message)) {
      throw new NoMessageError('No message found in context');
    }

    return this.ctx.message.text;
  }

  abstract start(...args): Promise<void>;
  abstract handle(...args): Promise<void>;
}
