import express from "npm:express";
import cors from "npm:cors";

import exec from "https://deno.land/std@0.116.0/node/child_process.ts";
import path from "https://deno.land/std@0.116.0/node/path.ts";

import { Logger } from '../.core/logger.ts';
import { CONFIG } from './config.ts';
import { STATE } from './state.ts';

export async function main(): Promise<void> {
  Logger.log('hello world from ./src/main.ts!');

  // STATE.PORT = CONFIG['PORT'] || 3000;

  // Configuration object
  const CONFIG = {
    PORT: 60002,
    TIMEOUT: 30000,
    CHROME_PATH: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    CHROME_USER_DATA_DIR: path.join(Deno.env.get('LOCALAPPDATA') || '', 'Google\\Chrome\\User Data'),
  };

  // State management
  const STATE = {
    latestPrompt: "",
    isProcessing: false,
    // closeRequest: false,
    lastResponse: "",
    resolveResponse: null as ((value: unknown) => void) | null,
  };

  const app = express();

  app.use(express.json());

  const launchChrome = () => {
    const args = [
      '--incognito',
      `--user-data-dir=${CONFIG.CHROME_USER_DATA_DIR}`,
      '--no-first-run',
      '--no-default-browser-check',
      `https://app.giz.ai/assistant`,
    ];


    return new Promise<void>((resolve, reject) => {
      console.log(`Launching Chrome with command: "${CONFIG.CHROME_PATH}" ${args.join(' ')}`);
      const cmd = new Deno.Command(CONFIG.CHROME_PATH, {
        args,
      });
      try {
        cmd.spawn();
        console.log('Chrome launched successfully');
        resolve();
      } catch (error) {
        console.error('Error launching Chrome:', error);
        reject(error);
      }
    });
  };

  
  const closeChrome = () => {
    console.log('Closing Chrome');

    return new Promise<void>((resolve, reject) => {
      const cmd = new Deno.Command('taskkill', {
        args: ['/im', 'chrome.exe', '/f'],
      });
      cmd.output().then(() => {
        console.log('Chrome closed successfully');
        resolve();
      }).catch(reject);
    });
  };

  app.post("/ask", async (req: any, res: any) => {
    console.log(`Received request to process prompt: ${req.url}`);
    const prompt = req.body.prompt;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Valid prompt is required" });
    }
    if (STATE.isProcessing) {
      return res.status(429).json({ error: "Currently processing a prompt. Please wait." });
    }

    STATE.latestPrompt = prompt;
    STATE.isProcessing = true;
    console.clear();
    console.log(`Prompt: ${prompt}`);

    try {
      await launchChrome();

      const response = await Promise.race([
        new Promise((resolve) => {
          STATE.resolveResponse = resolve;
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), CONFIG.TIMEOUT))
      ]);

      res.json({ response });
    } catch (error) {
      STATE.isProcessing = false;
      if (error.message === "Timeout") {
        res.status(504).json({ error: `Request timed out after ${CONFIG.TIMEOUT / 1000} seconds` });
      } else {
        res.status(500).json({ error: "An error occurred while processing the prompt" });
      }
    } finally {
      if (STATE.resolveResponse) {
        STATE.resolveResponse = null;
      }
    }
  });

  // const closeRequest = (): boolean => {
  //   STATE.closeRequest = false;

  //   return true;
  // };

  // app.get("/close-request", (req: any, res: any) => {
  //   res.json({ "close-request": STATE.closeRequest === true ? closeRequest() : false });
  // });

  app.get("/latest-prompt", (req: any, res: any) => {
    res.json({ prompt: STATE.latestPrompt });
  });

  app.post("/log-response", (req: any, res: any) => {
    const response = req.body.response;
    if (!response || typeof response !== "string") {
      return res.status(400).json({ error: "Valid response is required" });
    }

    STATE.isProcessing = false;
    STATE.lastResponse = response;
    STATE.latestPrompt = "";
    console.clear();
    console.log(`Response: ${response}`);

    if (STATE.resolveResponse) {
      STATE.resolveResponse(response);
      STATE.resolveResponse = null;
    }

    // STATE.closeRequest = true;
    closeChrome();

    res.json({ response });
  });

  app.get("/last-response", (req: any, res: any) => {
    res.json({ response: STATE.lastResponse });
  });

  app.post("/log-error", (req: any, res: any) => {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Valid error message is required" });
    }

    STATE.isProcessing = false;
    console.error(`Error occurred: ${message}`);

    if (STATE.resolveResponse) {
      STATE.resolveResponse(null);
      STATE.resolveResponse = null;
    }

    res.json({ message: "Error logged" });
  });

  app.use(cors());

  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  const server = app.listen(CONFIG.PORT, () => {
    console.log(`Server is running on ${CONFIG.PORT}`);
  });
  await Promise.resolve();
}
