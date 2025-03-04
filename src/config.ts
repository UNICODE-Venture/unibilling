import { WafeqConfig } from "./types";

/**
 * Default Wafeq API configuration values
 */
export const DEFAULT_CONFIG: Partial<WafeqConfig> = {
  baseUrl: "https://api.wafeq.com/v1",
  timeout: 10000,
};

/**
 * Creates a complete config object with defaults applied
 * @param config User-provided config
 * @returns Complete config with defaults applied
 */
export function createConfig(config: WafeqConfig): Required<WafeqConfig> {
  return {
    apiKey: config.apiKey,
    baseUrl: config.baseUrl || (DEFAULT_CONFIG.baseUrl as string),
    timeout: config.timeout || (DEFAULT_CONFIG.timeout as number),
  };
}
