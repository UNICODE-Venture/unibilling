# Wafeq Invoice SDK

A TypeScript SDK for interacting with the Wafeq Invoice API.

## Features

- Create, retrieve, list, and manage invoices
- Send invoices to customers
- Mark invoices as paid
- Cancel invoices
- Download invoice PDFs
- Request and response validation using Zod

## Installation

```bash
npm install wafeq-invoice-sdk
```

## Usage

### Basic Usage

```typescript
import { WafeqClient } from "wafeq-invoice-sdk";

// Initialize the client
const client = new WafeqClient({
  apiKey: "your-api-key",
  // Optional configurations
  baseUrl: "https://api.wafeq.com/v1",
  timeout: 10000,
});

// Create an invoice
const invoice = await client.createInvoice({
  invoice_number: "INV-2023-001",
  invoice_date: "2023-05-15",
  customer: {
    name: "Acme Corporation",
    email: "billing@acmecorp.com",
  },
  contact: "contact-id-123",
  currency: "USD",
  line_items: [
    {
      account: "account-id-123",
      description: "Web Development Services",
      quantity: 1,
      unit_amount: 1000,
    },
  ],
});

// Get an invoice by ID
const retrievedInvoice = await client.getInvoice("invoice-id-123");

// List invoices with pagination
const invoices = await client.listInvoices(1, 10);

// Send an invoice to the customer
const sendResult = await client.sendInvoice("invoice-id-123");

// Mark an invoice as paid
const paidInvoice = await client.markInvoiceAsPaid(
  "invoice-id-123",
  "2023-06-01"
);

// Cancel an invoice
const cancelResult = await client.cancelInvoice("invoice-id-123");

// Get invoice PDF URL
const pdfUrl = await client.getInvoicePdfUrl("invoice-id-123");
```

## Zod Validation

The SDK uses Zod for request and response validation in the `createInvoice` method. This ensures that your data is properly formatted before sending it to the API and that the response matches the expected structure.

### Benefits of Zod Validation

- Type safety: Ensures your data matches the expected schema
- Runtime validation: Catches errors before they reach the API
- Detailed error messages: Helps identify validation issues quickly

### Example with Validation

```typescript
import { WafeqClient } from "wafeq-invoice-sdk";
import { InvoiceCreateParams } from "wafeq-invoice-sdk/types";

async function createInvoiceExample() {
  const client = new WafeqClient({
    apiKey: "your-api-key",
  });

  try {
    const invoiceData: InvoiceCreateParams = {
      invoice_number: "INV-2023-001",
      invoice_date: "2023-05-15",
      customer: {
        name: "Acme Corporation",
        email: "billing@acmecorp.com",
      },
      contact: "contact-id-123",
      currency: "USD",
      line_items: [
        {
          account: "account-id-123",
          description: "Web Development Services",
          quantity: 1,
          unit_amount: 1000,
        },
      ],
    };

    // This will validate the request data before sending
    const invoice = await client.createInvoice(invoiceData);
    console.log("Invoice created successfully:", invoice);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Validation error")) {
      console.error("Invalid data:", error.message);
      // Handle validation error
    } else {
      console.error("API error:", error);
      // Handle API error
    }
  }
}
```

### Validation Errors

If your data doesn't match the expected schema, you'll receive a detailed error message:

```
Validation error: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": ["invoice_number"],
    "message": "Invoice number is required"
  }
]
```

## Error Handling

The SDK provides detailed error messages for both validation and API errors:

```typescript
try {
  const invoice = await client.createInvoice(invoiceData);
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes("Validation error")) {
      // Handle validation error
      console.error("Invalid data:", error.message);
    } else {
      // Handle API error
      console.error("API error:", error.message);
    }
  }
}
```

## License

MIT
