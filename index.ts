import {
  cyan,
  brightYellow,
  brightMagenta,
  green,
  red,
} from "https://deno.land/std@0.208.0/fmt/colors.ts";

import { Logger } from "./.core/logger.ts";
import { main } from "./src/main.ts";
import { setupEnv } from './.core/env.ts';

(async () => {
  try {
    const env = await setupEnv();

    Logger.clear();
    Logger.header(`${env.APP_NAME.toUpperCase()} - ${env.ENV.toUpperCase()} MODE`, true);

    Logger.logSection("Environment Variables", brightYellow, true);
    for (const [key, value] of Object.entries(env)) {
      Logger.logKeyValue(key, value, true);
    }

    Logger.logSection("Main Program", brightMagenta, true);
    const startTime = performance.now();
    await main();
    const endTime = performance.now();

    Logger.logSection("Program Completed", cyan, true);
    Logger.logKeyValue(
      "Main program execution time",
      `${green(`${(endTime - startTime).toFixed(2)} ms\n`)}`
    , true);
  } catch (error) {
    Logger.logSection("Error Occurred", red, true);
    console.error(red(`${error.message}`));
    throw error;
  }
})();