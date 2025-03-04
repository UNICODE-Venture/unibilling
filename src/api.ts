import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  WafeqConfig,
  Invoice,
  InvoiceCreateParams,
  PaginatedResponse,
  ApiResponse,
  BulkSendInvoiceParams,
} from "./types";
import { createConfig } from "./config";
import { createApiError } from "./utils";
import {
  InvoiceCreateParamsSchema,
  InvoiceSchema,
  BulkSendInvoiceParamsSchema,
} from "./schemas";

export class WafeqClient {
  private client: AxiosInstance;
  private config: Required<WafeqConfig>;

  constructor(config: WafeqConfig) {
    this.config = createConfig(config);

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        Authorization: `Api-Key ${this.config.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(createApiError(error))
    );
  }

  /**
   * Create a new invoice
   * @param params Invoice creation parameters
   * @returns Created invoice
   * @throws {Error} If validation fails
   */
  async createInvoice(params: InvoiceCreateParams): Promise<Invoice> {
    // Validate request parameters
    const validationResult = InvoiceCreateParamsSchema.safeParse(params);

    if (!validationResult.success) {
      throw new Error(`Validation error: ${validationResult.error.message}`);
    }

    try {
      const response = await this.client.post(
        "/invoices",
        validationResult.data
      );

      // Only validate successful responses
      if (response.status === 200 || response.status === 201) {
        // Validate response data structure
        const responseValidation = InvoiceSchema.safeParse(response.data);

        if (!responseValidation.success) {
          throw new Error(
            `Response validation error: ${responseValidation.error.message}`
          );
        }

        // Return the original response data to maintain type compatibility
        return response.data;
      }

      throw new Error(`Unexpected response status: ${response.status}`);
    } catch (error: any) {
      if (error.response) {
        // If we have an API error response, throw that directly
        throw createApiError(error);
      }
      // For other errors (like validation errors), throw as is
      throw error;
    }
  }

  /**
   * Get an invoice by ID
   * @param invoiceId ID of the invoice to retrieve
   * @returns Invoice details
   * @throws {Error} If validation fails
   */
  async getInvoice(invoiceId: string): Promise<Invoice> {
    try {
      const response = await this.client.get(`/invoices/${invoiceId}`);

      // Only validate successful responses
      if (response.status === 200) {
        // Validate response data structure
        const responseValidation = InvoiceSchema.safeParse(response.data);

        if (!responseValidation.success) {
          throw new Error(
            `Response validation error: ${responseValidation.error.message}`
          );
        }

        // Return the original response data to maintain type compatibility
        return response.data;
      }

      throw new Error(`Unexpected response status: ${response.status}`);
    } catch (error: any) {
      if (error.response) {
        // If we have an API error response, throw that directly
        throw createApiError(error);
      }
      // For other errors (like validation errors), throw as is
      throw error;
    }
  }

  /**
   * Cancel an invoice
   * @param invoiceId ID of the invoice to cancel
   * @returns Status of the operation
   */
  async cancelInvoice(invoiceId: string): Promise<ApiResponse<null>> {
    const response = await this.client.post(`/invoices/${invoiceId}/cancel`);
    return response.data;
  }

  /**
   * Download invoice PDF
   * @param invoiceId ID of the invoice to download
   * @returns ArrayBuffer containing the PDF file data
   * @throws {Error} If the download fails
   */
  async downloadInvoicePdf(invoiceId: string): Promise<ArrayBuffer> {
    try {
      const response = await this.client.get(
        `/invoices/${invoiceId}/download`,
        {
          responseType: "arraybuffer",
        }
      );

      if (response.status === 200) {
        return response.data;
      }

      throw new Error(`Unexpected response status: ${response.status}`);
    } catch (error: any) {
      if (error.response) {
        throw createApiError(error);
      }
      throw error;
    }
  }

  /**
   * Send multiple invoices to customers via email in bulk
   * @param params Bulk send invoice parameters
   * @returns void - Returns nothing on success, throws error on failure
   * @throws {Error} If validation fails
   */
  async bulkSendInvoices(params: BulkSendInvoiceParams): Promise<void> {
    // Validate request parameters
    const validationResult = BulkSendInvoiceParamsSchema.safeParse(params);

    if (!validationResult.success) {
      throw new Error(`Validation error: ${validationResult.error.message}`);
    }

    try {
      await this.client.post("/api-invoices/bulk_send/", validationResult.data);
    } catch (error: any) {
      if (error.response) {
        throw createApiError(error);
      }
      throw error;
    }
  }

  /**
   * Make a custom request to the Wafeq API
   * @param path API endpoint path
   * @param method HTTP method
   * @param data Request data (for POST, PUT, PATCH)
   * @param config Additional Axios config
   * @returns Response data
   */
  async request<T>(
    path: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    data?: any,
    config?: Partial<AxiosRequestConfig>
  ): Promise<T> {
    const response = await this.client.request({
      url: path,
      method,
      data,
      ...config,
    });
    return response.data;
  }
}
