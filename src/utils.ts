import { ApiError } from "./types";
import { AxiosError } from "axios";

/**
 * Creates a formatted API error from an axios error
 * @param error The original axios error
 * @returns Formatted API error
 */
export function createApiError(error: AxiosError): ApiError {
  const apiError = new Error(
    (error.response?.data as { message?: string })?.message ||
      "An error occurred with the Wafeq API"
  ) as ApiError;

  apiError.name = "WafeqApiError";
  apiError.status = error.response?.status;
  apiError.data = error.response?.data;

  return apiError;
}

/**
 * Formats a date to YYYY-MM-DD string
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Validates that a string is in YYYY-MM-DD format
 * @param dateStr Date string to validate
 * @returns Whether the string is valid
 */
export function isValidDateFormat(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}
