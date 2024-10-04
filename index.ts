import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

import { Logger } from './.core/logger.ts';
import { main } from "./src/main.ts";

interface Env {
  APP_NAME: string;
  ENV: string;
  [key: string]: string;
}

(() => {
  try {
    const env = config() as Env;
    
    Logger.header(`Starting ${env.APP_NAME || 'Application'}`);

    Logger.info("Environment Variables:");
    for (const [key, value] of Object.entries(env)) {
      Logger.envVar(key, value);
    }

    if (env.ENV === "production") {
      Logger.warn("Running in PRODUCTION mode");
    } else {
      Logger.info("Running in DEVELOPMENT mode");
    }

    Logger.header("MAIN PROGRAM");
    
    const startTime = performance.now();
    main();
    const endTime = performance.now();
    
    Logger.header("PROGRAM COMPLETED");
    Logger.success(`Execution time: ${(endTime - startTime).toFixed(2)}ms`);

  } catch (error) {
    Logger.error(`An error occurred: ${error.message}`);
    throw error;
  }
})();