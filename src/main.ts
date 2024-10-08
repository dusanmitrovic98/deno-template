import { Logger } from '../.core/logger.ts';
import { CONFIG } from './config.ts';
import { STATE } from './state.ts';

export async function main(): Promise<void> {
  Logger.log('hello world from ./src/main.ts!');
  Logger.log(`config: ${JSON.stringify(CONFIG)}`);
  STATE.PORT = 60002;
  Logger.log(`state: ${JSON.stringify(STATE)}`);

  await Promise.resolve();
}
