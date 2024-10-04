import { bold, green, yellow, blue, red, white, cyan } from "https://deno.land/std@0.208.0/fmt/colors.ts";

export enum LogLevel {
    INFO,
    SUCCESS,
    WARN,
    ERROR,
    NONE
}

export class Logger {
    private static currentLogLevel: LogLevel = LogLevel.INFO;

    private static timestamp(): string {
        const now = new Date();
        const hours = `0${now.getHours()}`.slice(-2);
        const minutes = `0${now.getMinutes()}`.slice(-2);
        const seconds = `0${now.getSeconds()}`.slice(-2);
        return `${hours}:${minutes}:${seconds}`;
    }

    static setLogLevel(level: LogLevel): void {
        this.currentLogLevel = level;
    }
    
    static success(message: string): void {
        if (this.currentLogLevel <= LogLevel.SUCCESS) {
            this.log(`${green('✔')} ${green(message)}`);
        }
    }

    static info(message: string): void {
        if (this.currentLogLevel <= LogLevel.INFO) {
            this.log(`${blue(message)}`);
        }
    }

    static warn(message: string): void {
        if (this.currentLogLevel <= LogLevel.WARN) {
            this.log(`${yellow('⚠')} ${yellow(message)}`);
        }
    }

    static error(message: string): void {
        if (this.currentLogLevel <= LogLevel.ERROR) {
            this.log(`${red('✖')} ${red(message)}`);
        }
    }

    static log(message: string, color: any = white, isBold: boolean = false): void {
        if (isBold) {
            console.log(`${bold(color(message))}`);
        } else {
            console.log(`${color(message)}`);
        }
    }

    static header(text: string) {
        console.log(bold(cyan(`
╔════════════════════════════════════════════════╗
║ ${text.padEnd(46)} ║
╚════════════════════════════════════════════════╝`)));
      }
    
      static logSection(title: string, color: (str: string) => string) {
        console.log(color(`\n■ ${title}`));
        console.log(color(`${'─'.repeat(50)}`));
      }
    
      static logKeyValue(key: string, value: string) {
        console.log(`${white(bold(key.padEnd(15)))} : ${value}`);
      }

      static clear(){
        console.clear();
      }
}
