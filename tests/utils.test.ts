import { createApiError, formatDate, isValidDateFormat } from "../src/utils";
import { AxiosError } from "axios";

describe("Utils", () => {
  describe("createApiError", () => {
    it("should create an API error with message from response data", () => {
      const axiosError = {
        response: {
          status: 400,
          data: {
            message: "Invalid request data",
          },
        },
      } as AxiosError;

      const apiError = createApiError(axiosError);

      expect(apiError.name).toBe("WafeqApiError");
      expect(apiError.message).toBe("Invalid request data");
      expect(apiError.status).toBe(400);
      expect(apiError.data).toEqual({ message: "Invalid request data" });
    });

    it("should create an API error with default message when no message in response", () => {
      const axiosError = {
        response: {
          status: 500,
          data: {},
        },
      } as AxiosError;

      const apiError = createApiError(axiosError);

      expect(apiError.name).toBe("WafeqApiError");
      expect(apiError.message).toBe("An error occurred with the Wafeq API");
      expect(apiError.status).toBe(500);
      expect(apiError.data).toEqual({});
    });

    it("should handle errors without response data", () => {
      const axiosError = {} as AxiosError;

      const apiError = createApiError(axiosError);

      expect(apiError.name).toBe("WafeqApiError");
      expect(apiError.message).toBe("An error occurred with the Wafeq API");
      expect(apiError.status).toBeUndefined();
      expect(apiError.data).toBeUndefined();
    });
  });

  describe("formatDate", () => {
    it("should format a date to YYYY-MM-DD", () => {
      const date = new Date("2023-01-15T12:30:45Z");
      const formatted = formatDate(date);
      expect(formatted).toBe("2023-01-15");
    });

    it("should handle different dates correctly", () => {
      const date1 = new Date("2022-12-31");
      const date2 = new Date("2023-02-28");

      expect(formatDate(date1)).toBe("2022-12-31");
      expect(formatDate(date2)).toBe("2023-02-28");
    });
  });

  describe("isValidDateFormat", () => {
    it("should return true for valid date format", () => {
      expect(isValidDateFormat("2023-01-15")).toBe(true);
    });

    it("should return false for invalid date formats", () => {
      expect(isValidDateFormat("01-15-2023")).toBe(false);
      expect(isValidDateFormat("2023/01/15")).toBe(false);
      expect(isValidDateFormat("2023.01.15")).toBe(false);
      expect(isValidDateFormat("Jan 15, 2023")).toBe(false);
      expect(isValidDateFormat("15-01-2023")).toBe(false);
    });
  });
});
