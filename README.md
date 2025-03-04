# UniBilling by **[UNICODE Team](https://www.unicodesolutions.co/)**

A powerful TypeScript SDK for seamless invoice and bill management with Wafeq, providing comprehensive invoice and bill generation and management capabilities

# UniBilling

A TypeScript SDK for interacting with the Wafeq Invoice and Bill API.

## Features

- Create, retrieve, and delete invoices
- Create and manage bills
- Download invoice PDFs
- Download bill PDFs
- Bulk send invoices
- Type-safe API with TypeScript support
- Automatic error handling
- Configurable timeout and base URL

## Installation

```bash
npm install unibilling
```

## Usage

### Basic Usage

```typescript
import { createClient } from "unibilling";

// Initialize the client
const client = createClient({
  apiKey: "your-api-key",
  // Optional configurations
  baseUrl: "https://api.wafeq.com/v1", // Default: https://api.wafeq.com/v1
  timeout: 10000, // Default: 10000ms
});

// Create an invoice
const invoice = await client.createInvoice({
  invoice_number: "INV-2023-001",
  invoice_date: "2023-05-15",
  customer: {
    name: "Acme Corporation",
    email: "billing@acmecorp.com",
    phone: "+1234567890",
    address: "123 Business St",
    taxIdentificationNumber: "TAX123",
  },
  contact: "contact-id-123",
  currency: "USD",
  line_items: [
    {
      account: "account-id-123",
      description: "Web Development Services",
      quantity: 1,
      unit_amount: 1000,
      tax_rate: "0.15", // Optional: 15% tax rate
      discount: 10, // Optional: 10% discount
    },
  ],
  // Optional fields
  invoice_due_date: "2023-06-15",
  notes: "Thank you for your business",
  language: "en", // Default: "en"
  place_of_supply: "DUBAI", // For UAE organizations
  status: "DRAFT", // Default: "DRAFT"
  tax_amount_type: "TAX_EXCLUSIVE", // Default: "TAX_EXCLUSIVE"
});

// Create a bill
const bill = await client.createBill({
  bill_number: "BILL-2023-001",
  bill_date: "2023-05-15",
  bill_due_date: "2023-06-15", // Required for bills
  contact: "contact-id-123", // Optional: The supplier contact ID
  currency: "USD",
  line_items: [
    {
      account: "account-id-123",
      description: "Office Supplies",
      quantity: 2,
      unit_amount: 500,
      tax_rate: "0.15", // Optional: 15% tax rate
      discount: 5, // Optional: 5% discount
    },
  ],
  // Optional fields
  notes: "Thank you for your service",
  language: "en", // Optional: Defaults to "en"
  attachments: ["receipt.pdf"], // Optional: Array of attachment URLs
  branch: "branch-id-123", // Optional: Branch associated with the bill
  debit_notes: [
    // Optional: Array of debit notes
    {
      amount: 100,
      debit_note: "debit-note-id-123",
    },
  ],
  order_number: "ORDER-001", // Optional: Associated order number
  project: "project-id-123", // Optional: Associated project
  reference: "REF-001", // Optional: Reference number
  status: "DRAFT", // Optional: Defaults to "DRAFT". Can be "DRAFT", "AUTHORIZED", or "PAID"
  tax_amount_type: "TAX_EXCLUSIVE", // Optional: Defaults to "TAX_EXCLUSIVE"
});

// Get an invoice by ID
const retrievedInvoice = await client.getInvoice("invoice-id-123");

// Download invoice PDF
const pdfBuffer = await client.downloadInvoicePdf("invoice-id-123");

// Download bill PDF
const billPdfBuffer = await client.downloadBillPdf("bill-id-123");

// Delete an invoice
await client.deleteInvoice("invoice-id-123");

// Bulk send invoices
await client.bulkSendInvoices({
  invoice_number: "INV-001",
  invoice_date: "2024-03-20",
  currency: "USD",
  language: "en",
  tax_amount_type: "TAX_EXCLUSIVE",
  contact: {
    name: "John Doe",
    email: "john@example.com",
  },
  line_items: [
    {
      name: "Consulting Services",
      description: "Professional consulting",
      quantity: 1,
      price: 1000,
      tax_rate: {
        name: "VAT",
        rate: 15,
      },
    },
  ],
  channels: [
    {
      medium: "Email",
      data: {
        subject: "Your Invoice",
        message: "Please find your invoice attached.",
        recipients: {
          to: ["john@example.com"],
        },
      },
    },
  ],
});
```

## Type Safety

The SDK provides full TypeScript support with comprehensive type definitions for all requests and responses. This ensures:

- Type checking for all API parameters
- Autocomplete support in your IDE
- Runtime type safety for API responses

## Error Handling

The SDK provides detailed error handling for API requests:

```typescript
try {
  const invoice = await client.createInvoice(invoiceData);
} catch (error) {
  if (error instanceof Error) {
    console.error("API error:", error.message);
    // Handle API error
  }
}
```

## Supported Currencies

The SDK supports a wide range of currencies including:

- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- AED (UAE Dirham)
- SAR (Saudi Riyal)
- And many more...

## Language Support

The SDK supports multiple languages for invoice generation:

- English (en)
- Arabic (ar)

## License

MIT

#### If you enjoyed using UniBilling, then give it a star ⭐️ and like 👍🏻. For more innovative solutions from our team, visit [Team UNICODE](https://www.unicodesolutions.co/). Keep coding and stay awesome 😉
