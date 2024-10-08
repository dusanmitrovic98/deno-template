import { Logger } from '../.core/logger.ts';
import { CONFIG } from './config.ts';
import { STATE } from './state.ts';

export async function main(resolve: (value: { message: string }) => Promise<void>, reject: (error: Error) => Promise<void>): Promise<void> {
  try {
    await Logger.log('hello world from ./src/main.ts!');
    await Logger.log(`config: ${JSON.stringify(CONFIG)}`);
    STATE.PORT = 60002;
    await Logger.log(`state: ${JSON.stringify(STATE)}`);

    await resolve({
      message: 'Program Completed'
    });
  } catch (error) {
    await Logger.error(error);
    await reject(error);
  }
}