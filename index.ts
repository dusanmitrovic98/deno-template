import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

import { main } from "./src/main.ts";

(() => {
  interface Env {
    APP_NAME: string;
    ENV: string;
    [key: string]: string;
  }

  const env = config() as Env;

  console.log(env.APP_NAME);

  main();
})();
