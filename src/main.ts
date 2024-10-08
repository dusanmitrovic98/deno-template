import path from "https://deno.land/std@0.116.0/node/path.ts";
import express from "npm:express";
import cors from "npm:cors";


import { Logger } from '../.core/logger.ts';
import { CONFIG } from './config.ts';
import { STATE } from './state.ts';

export async function main(): Promise<void> {
  Logger.log('hello world from ./src/main.ts!');
  
  await Promise.resolve();
}
