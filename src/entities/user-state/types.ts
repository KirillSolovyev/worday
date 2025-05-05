import type { IUser } from '../user';
export interface IUserState {
  id: string;
  user: IUser;
  currentState: UserStateEnum;
}

export enum UserStateEnum {
  /**
   * @description When a user is logged in, but has not yet completed the settings setup
   */
  INIT = 'INIT',
  /**
   * @description When a user needs to set up their base language
   */
  INIT_BASE_LANGUAGE = 'INIT_BASE_LANGUAGE',
  /**
   * @description When a user needs to set up their target language
   */
  INIT_TARGET_LANGUAGE = 'INIT_TARGET_LANGUAGE',
  /**
   * @description When a user needs to set up their language level
   */
  INIT_LANGUAGE_LEVEL = 'INIT_LANGUAGE_LEVEL',
  /**
   * @description When a user needs to set up their topics
   */
  INIT_TOPICS = 'INIT_TOPICS',
  /**
   * @description When a user is setting up their base language
   */
  SETTINGS_BASE_LANGUAGE = 'SETTINGS_BASE_LANGUAGE',
  /**
   * @description When a user is setting up their target language
   */
  SETTINGS_TARGET_LANGUAGE = 'SETTINGS_TARGET_LANGUAGE',
  /**
   * @description When a user is setting up their language level
   */
  SETTINGS_LANGUAGE_LEVEL = 'SETTINGS_LANGUAGE_LEVEL',
  /**
   * @description When a user is setting up their topics
   */
  SETTINGS_TOPICS = 'SETTINGS_TOPICS',
  /**
   * @description When a user is ready to generate a word of the day
   */
  WORD = 'WORD',
}
