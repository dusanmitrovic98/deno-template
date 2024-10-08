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

    await Logger.clear();
    await Logger.header(`${env.APP_NAME.toUpperCase()} - ${env.ENV.toUpperCase()} MODE`, true);

    await Logger.logSection("Environment Variables", brightYellow, true);
    for (const [key, value] of Object.entries(env)) {
      await Logger.logKeyValue(key, value, true);
    }

    await Logger.logSection("Main Program", brightMagenta, true);
    const startTime = performance.now();

    await main(async (response: any) => {
      await Logger.logSection(response.message, cyan, true);
    }, async (error: any) => {
      await Logger.logSection("Program Failed", red, true);
      throw error;
    });

    const endTime = performance.now();
    await Logger.logKeyValue(
      "Main program execution time",
      `${green(`${(endTime - startTime).toFixed(2)} ms\n`)}`,
      true
    );
  } catch (error) {
    await Logger.logSection("Error Occurred", red, true);
    await Logger.error(red(`${error.message}`));
    throw error;
  }
})();