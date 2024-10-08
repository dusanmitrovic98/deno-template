import { bold, green, yellow, blue, red, white, cyan } from "https://deno.land/std@0.208.0/fmt/colors.ts";

import { setupEnv } from './env.ts';

export enum LogLevel {
    INFO,
    SUCCESS,
    WARN,
    ERROR,
    NONE
}

const env = await setupEnv();

export class Logger {
    private static environment: string = env.ENV;

    private static timestamp(): string {
        const now = new Date();
        const hours = `0${now.getHours()}`.slice(-2);
        const minutes = `0${now.getMinutes()}`.slice(-2);
        const seconds = `0${now.getSeconds()}`.slice(-2);
        return `${hours}:${minutes}:${seconds}`;
    }

    static async setEnvironment(env: string): Promise<void> {
        this.environment = env;
    }

    private static shouldLog(forceLog: boolean): boolean {
        return forceLog || this.environment === 'development';
    }

    static async success(message: string, forceLog: boolean = false): Promise<void> {
        if (this.shouldLog(forceLog)) {
            this.log(`${green('✔')} ${green(message)}`);
        }
    }

    static async info(message: string, forceLog: boolean = false): Promise<void> {
        if (this.shouldLog(forceLog)) {
            this.log(`${blue(message)}`);
        }
    }

    static async warn(message: string, forceLog: boolean = false): Promise<void> {
        if (this.shouldLog(forceLog)) {
            this.log(`${yellow('⚠')} ${yellow(message)}`);
        }
    }

    static async error(message: string, forceLog: boolean = false): Promise<void> {
        if (this.shouldLog(forceLog)) {
            this.log(`${red('✖')} ${red(message)}`);
        }
    }

    static async log(message: string, color: any = white, isBold: boolean = false): Promise<void> {
        if (isBold) {
            console.log(`${bold(color(message))}`);
        } else {
            console.log(`${color(message)}`);
        }
    }

    static async header(text: string, forceLog: boolean = false): Promise<void> {
        if (this.shouldLog(forceLog)) {
            console.log(bold(cyan(`
╔════════════════════════════════════════════════╗
║ ${text.padEnd(46)} ║
╚════════════════════════════════════════════════╝`)));
        }
    }

    static async logSection(title: string, color: (str: string) => string, forceLog: boolean = false): Promise<void> {
        if (this.shouldLog(forceLog)) {
            console.log(color(`\n■ ${title}`));
            console.log(color(`${'─'.repeat(50)}`));
        }
    }

    static async logKeyValue(key: string, value: string, forceLog: boolean = false): Promise<void> {
        if (this.shouldLog(forceLog)) {
            console.log(`${white(bold(key.padEnd(15)))} : ${value}`);
        }
    }

    static async clear(): Promise<void> {
        console.clear();
    }
}