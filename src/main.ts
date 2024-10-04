import { Logger } from '../.core/logger.ts';

export async function main(): Promise<void> {
  Logger.log('hello world from ./src/main.ts!');
  await Promise.resolve();
}
