import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  WafeqConfig,
  Invoice,
  InvoiceCreateParams,
  BulkSendInvoiceParams,
} from "./types";
import { createConfig } from "./config";
import { createApiError } from "./utils";

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

  private async handleResponse<T>(response: any): Promise<T> {
    if (
      response.status !== 200 &&
      response.status !== 201 &&
      response.status !== 204
    ) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    return response.data;
  }

  private async makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    data?: any,
    config?: Partial<AxiosRequestConfig>
  ): Promise<T> {
    try {
      const response = await this.client.request({
        url: path,
        method,
        data,
        ...config,
      });
      return this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.response) {
        throw createApiError(error);
      }
      throw error;
    }
  }

  /**
   * Create a new invoice
   * @param params Invoice creation parameters
   * @returns Created invoice
   */
  async createInvoice(params: InvoiceCreateParams): Promise<Invoice> {
    return this.makeRequest<Invoice>("POST", "/invoices", params);
  }

  /**
   * Get an invoice by ID
   * @param invoiceId ID of the invoice to retrieve
   * @returns Invoice details
   */
  async getInvoice(invoiceId: string): Promise<Invoice> {
    return this.makeRequest<Invoice>("GET", `/invoices/${invoiceId}`);
  }

  /**
   * Delete an invoice by ID
   * @param invoiceId ID of the invoice to delete
   * @throws {Error} If the deletion fails
   */
  async deleteInvoice(invoiceId: string): Promise<void> {
    await this.makeRequest<void>("DELETE", `/invoices/${invoiceId}`);
  }

  /**
   * Download invoice PDF
   * @param invoiceId ID of the invoice to download
   * @returns ArrayBuffer containing the PDF file data
   * @throws {Error} If the download fails
   */
  async downloadInvoicePdf(invoiceId: string): Promise<ArrayBuffer> {
    return this.makeRequest<ArrayBuffer>(
      "GET",
      `/invoices/${invoiceId}/download`,
      undefined,
      { responseType: "arraybuffer" }
    );
  }

  /**
   * Send multiple invoices to customers via email in bulk
   * @param params Bulk send invoice parameters
   * @returns void - Returns nothing on success, throws error on failure
   */
  async bulkSendInvoices(params: BulkSendInvoiceParams): Promise<void> {
    await this.makeRequest<void>("POST", "/api-invoices/bulk_send/", params);
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
    return this.makeRequest<T>(method, path, data, config);
  }
}
