import { 
  cyan, brightYellow, brightMagenta, green, white, red, bold 
} from 'https://deno.land/std@0.208.0/fmt/colors.ts';
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { Logger } from './.core/logger.ts';
import { main } from "./src/main.ts";

interface Env {
  APP_NAME: string;
  ENV: string;
  [key: string]: string;
}

(async () => {
  try {
    const env = config() as Env;
    
    Logger.header(`${env.APP_NAME.toUpperCase()} - ${env.ENV.toUpperCase()} MODE`);

    Logger.logSection("Environment Variables", brightYellow);
    Logger.logKeyValue("APP_NAME", env.APP_NAME);
    Logger.logKeyValue("ENV", env.ENV);

    Logger.logSection("Main Program", brightMagenta);
    const startTime = performance.now();
    await main();
    const endTime = performance.now();
    
    Logger.logSection("Program Completed", cyan);
    Logger.logKeyValue("Execution time", `${green(`${(endTime - startTime).toFixed(2)} ms\n`)}`);

  } catch (error) {
    Logger.logSection("Error Occurred", red);
    console.error(red(`${error.message}`));
    throw error;
  }
})();