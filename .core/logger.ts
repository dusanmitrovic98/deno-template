import { bold, green, yellow, blue, red } from "https://deno.land/std@0.208.0/fmt/colors.ts";

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
        const milliseconds = `00${now.getMilliseconds()}`.slice(-3);
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    static setLogLevel(level: LogLevel): void {
        this.currentLogLevel = level;
    }

    static info(message: string): void {
        if (this.currentLogLevel <= LogLevel.INFO) {
            this.log(`${blue(`[${this.timestamp()}]`)} ${bold(message)}`);
        }
    }

    static success(message: string): void {
        if (this.currentLogLevel <= LogLevel.SUCCESS) {
            this.log(`${blue(`[${this.timestamp()}]`)} ${green('✔')} ${green(message)}`);
        }
    }

    static warn(message: string): void {
        if (this.currentLogLevel <= LogLevel.WARN) {
            this.log(`${blue(`[${this.timestamp()}]`)} ${yellow('⚠')} ${yellow(message)}`);
        }
    }

    static error(message: string): void {
        if (this.currentLogLevel <= LogLevel.ERROR) {
            this.log(`${blue(`[${this.timestamp()}]`)} ${red('✖')} ${red(message)}`);
        }
    }


    static header(message: string): void {
        const line = "=".repeat(message.length + 4);
        this.log(`
${bold(blue(line))}
${bold(blue(`= ${message} =`))}
${bold(blue(line))}
`);
    }

    static envVar(key: string, value: string): void {
        this.log(`${blue(`[${this.timestamp()}]`)} ${bold(key)}: ${value}`);
    }

    private static log(message: string): void {
        console.log(message);
    }
}
