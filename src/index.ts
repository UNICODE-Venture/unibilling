import { WafeqClient } from "./api";
import { WafeqConfig } from "./types";

/**
 * Create a new Wafeq API client instance
 * @param config Configuration for the Wafeq client
 * @returns A configured WafeqClient instance
 */
export function createClient(config: WafeqConfig): WafeqClient {
  return new WafeqClient(config);
}

// Export all types and classes
export { WafeqClient } from "./api";
export * from "./types";

// Export utility functions
export { createApiError } from "./utils";
export { createConfig } from "./config";
