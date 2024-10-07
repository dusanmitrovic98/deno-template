import config from "./config.json" with { type: "json" };

type ConfigValue = string | number | boolean | object | null;

export let CONFIG: Record<string, ConfigValue> = {};

for (const [key, value] of Object.entries(config)) {
	CONFIG[key] = value;
}