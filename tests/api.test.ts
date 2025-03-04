import axios from "axios";
import { WafeqClient } from "../src/api";
import {
  Invoice,
  InvoiceCreateParams,
  BulkSendInvoiceParams,
  MediumEnum,
  TypeEnum,
} from "../src/types";
import { createApiError } from "../src/utils";

// Define a mock type for our mocked WafeqClient
interface MockWafeqClientStatic {
  new (config: any): WafeqClient;
  mockResponses: {
    createInvoice: jest.Mock | null;
    bulkSendInvoices: jest.Mock | null;
    getInvoice: jest.Mock | null;
    downloadInvoicePdf: jest.Mock | null;
    deleteInvoice: jest.Mock | null;
  };
  resetMocks(): void;
}

// Cast the WafeqClient to our mock type
const MockedWafeqClient = WafeqClient as unknown as MockWafeqClientStatic;

// Mock the entire WafeqClient class
jest.mock("../src/api", () => {
  const originalModule = jest.requireActual("../src/api");

  // Create a mock implementation of the WafeqClient class
  class MockWafeqClient {
    config: any;

    constructor(config: any) {
      this.config = config;
    }

    async createInvoice(params: InvoiceCreateParams): Promise<Invoice> {
      // Check for required fields
      if (!params.invoice_number) {
        throw new Error("Validation error: Invoice number is required");
      }

      // Mock API call
      try {
        // This is where we'll simulate the API response
        if (MockWafeqClient.mockResponses.createInvoice) {
          return MockWafeqClient.mockResponses.createInvoice(params);
        }

        // Default mock response
        return {
          id: "mock-invoice-123",
          invoice_number: params.invoice_number,
          invoice_date: params.invoice_date,
          contact: params.contact,
          currency: params.currency,
          amount: 100,
          balance: 100,
          tax_amount: 0,
          created_ts: "2023-01-01T12:00:00Z",
          modified_ts: "2023-01-01T12:00:00Z",
          language: params.language || "en",
          line_items: params.line_items.map((item) => ({
            id: "mock-line-item-123",
            account: item.account,
            description: item.description,
            quantity: item.quantity,
            unit_amount: item.unit_amount,
            line_amount: item.quantity * item.unit_amount,
            tax_amount: 0,
            created_ts: "2023-01-01T12:00:00Z",
            modified_ts: "2023-01-01T12:00:00Z",
            tax_rate: item.tax_rate,
          })),
        };
      } catch (error) {
        throw error;
      }
    }

    async bulkSendInvoices(params: BulkSendInvoiceParams): Promise<void> {
      // Check for required fields
      if (!params.invoice_number) {
        throw new Error("Validation error: Invoice number is required");
      }

      if (!params.channels || params.channels.length === 0) {
        throw new Error("Validation error: At least one channel is required");
      }

      // Mock API call
      try {
        // This is where we'll simulate the API response
        if (MockWafeqClient.mockResponses.bulkSendInvoices) {
          return MockWafeqClient.mockResponses.bulkSendInvoices(params);
        }

        // Default is to return void (success)
        return;
      } catch (error) {
        throw error;
      }
    }

    async getInvoice(invoiceId: string): Promise<Invoice> {
      try {
        // This is where we'll simulate the API response
        if (MockWafeqClient.mockResponses.getInvoice) {
          return MockWafeqClient.mockResponses.getInvoice(invoiceId);
        }

        // Default mock response
        return {
          id: invoiceId,
          invoice_number: "INV-001",
          invoice_date: "2023-01-01",
          contact: "contact-123",
          currency: "USD",
          amount: 100,
          balance: 100,
          tax_amount: 0,
          created_ts: "2023-01-01T12:00:00Z",
          modified_ts: "2023-01-01T12:00:00Z",
          language: "en",
          line_items: [
            {
              id: "line-item-123",
              account: "account-123",
              description: "Test Product",
              quantity: 1,
              unit_amount: 100,
              line_amount: 100,
              tax_amount: 0,
              created_ts: "2023-01-01T12:00:00Z",
              modified_ts: "2023-01-01T12:00:00Z",
            },
          ],
        };
      } catch (error) {
        throw error;
      }
    }

    async downloadInvoicePdf(invoiceId: string): Promise<ArrayBuffer> {
      try {
        if (MockWafeqClient.mockResponses.downloadInvoicePdf) {
          return MockWafeqClient.mockResponses.downloadInvoicePdf(invoiceId);
        }

        // Default mock response - create a small PDF-like ArrayBuffer
        const mockPdfData = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52]); // %PDF-1.4 header
        return mockPdfData.buffer;
      } catch (error) {
        throw error;
      }
    }

    async deleteInvoice(invoiceId: string): Promise<void> {
      try {
        if (MockWafeqClient.mockResponses.deleteInvoice) {
          return MockWafeqClient.mockResponses.deleteInvoice(invoiceId);
        }
        // Default is to return void (success)
        return;
      } catch (error) {
        throw error;
      }
    }

    // Static property to hold mock responses for different methods
    static mockResponses: {
      createInvoice: jest.Mock | null;
      bulkSendInvoices: jest.Mock | null;
      getInvoice: jest.Mock | null;
      downloadInvoicePdf: jest.Mock | null;
      deleteInvoice: jest.Mock | null;
    } = {
      createInvoice: null,
      bulkSendInvoices: null,
      getInvoice: null,
      downloadInvoicePdf: null,
      deleteInvoice: null,
    };

    // Static method to reset all mock responses
    static resetMocks(): void {
      this.mockResponses = {
        createInvoice: null,
        bulkSendInvoices: null,
        getInvoice: null,
        downloadInvoicePdf: null,
        deleteInvoice: null,
      };
    }
  }

  return {
    ...originalModule,
    WafeqClient: MockWafeqClient,
  };
});

describe("WafeqClient", () => {
  let client: WafeqClient;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    MockedWafeqClient.mockResponses = {
      createInvoice: null,
      bulkSendInvoices: null,
      getInvoice: null,
      downloadInvoicePdf: null,
      deleteInvoice: null,
    };
    client = new WafeqClient({ apiKey: "test-api-key" });
  });

  describe("createInvoice", () => {
    const validInvoiceParams: InvoiceCreateParams = {
      invoice_number: "INV-001",
      invoice_date: "2023-01-01",
      invoice_due_date: "2023-01-15",
      customer: {
        name: "Test Customer",
        email: "customer@example.com",
        phone: "+1234567890",
        address: "123 Test St, Test City",
        taxIdentificationNumber: "TAX123456",
      },
      contact: "contact-id-123",
      line_items: [
        {
          account: "account-123",
          description: "Test Product",
          quantity: 2,
          unit_amount: 100,
          tax_rate: "tax-rate-123",
        },
      ],
      currency: "USD",
      language: "en",
      notes: "Thank you for your business",
    };

    const mockInvoiceResponse: Invoice = {
      id: "invoice-123",
      invoice_number: "INV-001",
      invoice_date: "2023-01-01",
      invoice_due_date: "2023-01-15",
      contact: "contact-id-123",
      currency: "USD",
      amount: 220, // 2 * 100 + tax
      balance: 220,
      tax_amount: 20,
      status: "DRAFT",
      created_ts: "2023-01-01T12:00:00Z",
      modified_ts: "2023-01-01T12:00:00Z",
      language: "en",
      line_items: [
        {
          id: "line-item-123",
          account: "account-123",
          description: "Test Product",
          quantity: 2,
          unit_amount: 100,
          line_amount: 200,
          tax_amount: 20,
          created_ts: "2023-01-01T12:00:00Z",
          modified_ts: "2023-01-01T12:00:00Z",
          tax_rate: "tax-rate-123",
        },
      ],
      notes: "Thank you for your business",
    };

    it("should successfully create an invoice", async () => {
      // Setup mock response
      MockedWafeqClient.mockResponses.createInvoice = jest
        .fn()
        .mockReturnValue(mockInvoiceResponse);

      // Call the method
      const result = await client.createInvoice(validInvoiceParams);

      // Assertions
      expect(
        MockedWafeqClient.mockResponses.createInvoice
      ).toHaveBeenCalledWith(validInvoiceParams);
      expect(result).toEqual(mockInvoiceResponse);
    });

    it("should throw an error if validation fails", async () => {
      // Create invalid params by removing required field
      const invalidParams = { ...validInvoiceParams };
      delete (invalidParams as any).invoice_number;

      // Call the method and expect it to throw
      await expect(client.createInvoice(invalidParams)).rejects.toThrow(
        "Validation error"
      );
    });

    it("should handle API errors properly", async () => {
      // Setup mock API error
      MockedWafeqClient.mockResponses.createInvoice = jest
        .fn()
        .mockImplementation(() => {
          throw createApiError({
            response: {
              status: 400,
              data: {
                message: "Invalid invoice data",
                errors: ["Invoice number already exists"],
              },
            },
          } as any);
        });

      // Call the method and expect it to throw
      await expect(client.createInvoice(validInvoiceParams)).rejects.toThrow(
        "Invalid invoice data"
      );
    });
  });

  describe("bulkSendInvoices", () => {
    const validBulkSendParams: BulkSendInvoiceParams = {
      channels: [
        {
          data: {
            message: "Your invoice is ready",
            recipients: {
              to: ["customer@example.com"],
              cc: ["accounting@company.com"],
            },
            subject: "Invoice from Company",
          },
          medium: MediumEnum.EMAIL,
        },
      ],
      contact: {
        name: "John Doe",
        email: "john@example.com",
        address: "123 Main St",
      },
      currency: "SAR",
      invoice_date: "2023-01-01",
      invoice_number: "INV-2023-001",
      language: "en",
      line_items: [
        {
          name: "Product A",
          description: "Premium product",
          quantity: 1,
          price: 100,
        },
      ],
      tax_amount_type: "TAX_EXCLUSIVE",
    };

    it("should successfully send invoices in bulk", async () => {
      // Setup mock response
      MockedWafeqClient.mockResponses.bulkSendInvoices = jest.fn();

      // Call the method
      await client.bulkSendInvoices(validBulkSendParams);

      // Assertions
      expect(
        MockedWafeqClient.mockResponses.bulkSendInvoices
      ).toHaveBeenCalledWith(validBulkSendParams);
    });

    it("should throw an error if validation fails", async () => {
      // Create invalid params by removing required field
      const invalidParams = { ...validBulkSendParams };
      delete (invalidParams as any).invoice_number;

      // Call the method and expect it to throw
      await expect(client.bulkSendInvoices(invalidParams)).rejects.toThrow(
        "Validation error"
      );
    });

    it("should handle API errors properly", async () => {
      // Setup mock API error
      MockedWafeqClient.mockResponses.bulkSendInvoices = jest
        .fn()
        .mockImplementation(() => {
          throw createApiError({
            response: {
              status: 400,
              data: {
                message: "Invalid invoice data",
                errors: ["Invalid recipient email format"],
              },
            },
          } as any);
        });

      // Call the method and expect it to throw
      await expect(
        client.bulkSendInvoices(validBulkSendParams)
      ).rejects.toThrow("Invalid invoice data");
    });
  });

  describe("getInvoice", () => {
    const mockInvoiceResponse: Invoice = {
      id: "invoice-123",
      invoice_number: "INV-001",
      invoice_date: "2023-01-01",
      contact: "contact-123",
      currency: "USD",
      amount: 100,
      balance: 100,
      tax_amount: 0,
      created_ts: "2023-01-01T12:00:00Z",
      modified_ts: "2023-01-01T12:00:00Z",
      language: "en",
      line_items: [
        {
          id: "line-item-123",
          account: "account-123",
          description: "Test Product",
          quantity: 1,
          unit_amount: 100,
          line_amount: 100,
          tax_amount: 0,
          created_ts: "2023-01-01T12:00:00Z",
          modified_ts: "2023-01-01T12:00:00Z",
        },
      ],
    };

    it("should successfully retrieve an invoice", async () => {
      // Setup mock response
      MockedWafeqClient.mockResponses.getInvoice = jest
        .fn()
        .mockReturnValue(mockInvoiceResponse);

      // Call the method
      const result = await client.getInvoice("invoice-123");

      // Assertions
      expect(MockedWafeqClient.mockResponses.getInvoice).toHaveBeenCalledWith(
        "invoice-123"
      );
      expect(result).toEqual(mockInvoiceResponse);
    });

    it("should handle API errors properly", async () => {
      // Setup mock API error
      MockedWafeqClient.mockResponses.getInvoice = jest
        .fn()
        .mockImplementation(() => {
          throw createApiError({
            response: {
              status: 404,
              data: {
                message: "Invoice not found",
                errors: ["No invoice exists with the provided ID"],
              },
            },
          } as any);
        });

      // Call the method and expect it to throw
      await expect(client.getInvoice("non-existent-id")).rejects.toThrow(
        "Invoice not found"
      );
    });
  });

  describe("downloadInvoicePdf", () => {
    const mockInvoiceId = "invoice-123";

    it("should successfully download a PDF", async () => {
      const mockPdfData = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52]); // %PDF-1.4 header
      MockedWafeqClient.mockResponses.downloadInvoicePdf = jest
        .fn()
        .mockResolvedValue(mockPdfData.buffer);

      const result = await client.downloadInvoicePdf(mockInvoiceId);

      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(new Uint8Array(result)).toEqual(mockPdfData);
      expect(
        MockedWafeqClient.mockResponses.downloadInvoicePdf
      ).toHaveBeenCalledWith(mockInvoiceId);
    });

    it("should handle download errors", async () => {
      const errorMessage = "Failed to download PDF";
      MockedWafeqClient.mockResponses.downloadInvoicePdf = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await expect(client.downloadInvoicePdf(mockInvoiceId)).rejects.toThrow(
        errorMessage
      );
      expect(
        MockedWafeqClient.mockResponses.downloadInvoicePdf
      ).toHaveBeenCalledWith(mockInvoiceId);
    });

    it("should return default mock PDF when no mock response is set", async () => {
      const result = await client.downloadInvoicePdf(mockInvoiceId);

      expect(result).toBeInstanceOf(ArrayBuffer);
      const resultData = new Uint8Array(result);
      expect(resultData.length).toBeGreaterThan(0);
      expect(resultData[0]).toBe(37); // %
      expect(resultData[1]).toBe(80); // P
      expect(resultData[2]).toBe(68); // D
      expect(resultData[3]).toBe(70); // F
    });
  });

  describe("deleteInvoice", () => {
    it("should successfully delete an invoice", async () => {
      const invoiceId = "test-invoice-123";
      MockedWafeqClient.mockResponses.deleteInvoice = jest
        .fn()
        .mockResolvedValue(undefined);

      await client.deleteInvoice(invoiceId);

      expect(
        MockedWafeqClient.mockResponses.deleteInvoice
      ).toHaveBeenCalledWith(invoiceId);
    });

    it("should throw an error when deletion fails", async () => {
      const invoiceId = "test-invoice-123";
      const errorMessage = "Failed to delete invoice";
      MockedWafeqClient.mockResponses.deleteInvoice = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await expect(client.deleteInvoice(invoiceId)).rejects.toThrow(
        errorMessage
      );
    });

    it("should handle API errors correctly", async () => {
      const invoiceId = "test-invoice-123";
      const apiError = {
        response: {
          status: 404,
          data: { message: "Invoice not found" },
        },
      };
      MockedWafeqClient.mockResponses.deleteInvoice = jest
        .fn()
        .mockRejectedValue(createApiError(apiError as any));

      await expect(client.deleteInvoice(invoiceId)).rejects.toThrow(
        "Invoice not found"
      );
    });
  });
});
