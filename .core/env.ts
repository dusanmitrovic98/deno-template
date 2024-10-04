import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { red } from "https://deno.land/std@0.208.0/fmt/colors.ts";


export interface Env {
    APP_NAME: string;
    ENV: string;
    [key: string]: string;
}

const requiredVars = ['APP_NAME', 'ENV'];

async function updateEnvFile(env: Env) {
    const encoder = new TextEncoder();
    let content = '';
    for (const [key, value] of Object.entries(env)) {
        content += `${key}=${value}\n`;
    }
    await Deno.writeFile('.env', encoder.encode(content));
}

function validateEnv(env: Env): string[] {
    const missingVars = requiredVars.filter(varName => !env[varName]);
    return missingVars;
}

export async function setupEnv(): Promise<Env> {
    let env = config() as Env;
    let envUpdated = false;

    const missingVars = validateEnv(env);

    for (const varName of missingVars) {
        if (varName === 'APP_NAME') {
            const appName = prompt(`Please enter the ${varName}:`);
            if (appName) {
                env[varName] = appName;
                envUpdated = true;
            } else {
                throw new Error(`${varName} is required`);
            }
        } else if (varName === 'ENV') {
            let isValidEnv = false;
            while (!isValidEnv) {
                let envInput = prompt(`Please enter the environment ("d" or "development" for development, "p" or "production" for production):`);
                if (envInput) {
                    envInput = envInput.toLowerCase();
                    if (envInput === 'd' || envInput === 'development') {
                        env[varName] = 'development';
                        isValidEnv = true;
                    } else if (envInput === 'p' || envInput === 'production') {
                        env[varName] = 'production';
                        isValidEnv = true;
                    } else {
                        console.log(red(`Invalid input "${envInput}".`));
                    }
                } else {
                    console.log("Environment is required. Please enter a valid value.");
                }
            }
            envUpdated = true;
        }
    }

    if (envUpdated) {
        await updateEnvFile(env);
        console.log("Updated .env file with new values");
    }

    return env;
}