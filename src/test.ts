import { WafeqClient } from "./api";
import { CurrencyEnum, TaxAmountTypeEnum, LanguageAc1Enum } from "./types";

// Initialize the client with your API key
const client = new WafeqClient({
  apiKey: "wjhMqmLz.mPjS7eK2XMNUxE80nufD5LWXU2shzs2x", // Replace with your actual API key
  baseUrl: "https://api.wafeq.com/v1", // Adjust if using a different base URL
});

async function listContactsAndAccounts() {
  try {
    console.log("Fetching contacts...");
    const contacts = await client.request("/contacts");
    console.log("Available contacts:", JSON.stringify(contacts, null, 2));

    console.log("\nFetching accounts...");
    const accounts = await client.request("/accounts");
    console.log("Available accounts:", JSON.stringify(accounts, null, 2));
  } catch (error: any) {
    console.error("Error fetching data:");
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error(
        "Response data:",
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error("Error:", error.message);
    }
  }
}

async function testCreateInvoice() {
  try {
    console.log("Creating invoice...");
    const invoiceData = {
      invoice_number: "INV-2024-001",
      invoice_date: "2024-04-15",
      customer: {
        name: "Test Customer",
        email: "test@example.com",
      },
      contact: "contact-123", // Replace with actual contact ID
      line_items: [
        {
          account: "account-123", // Replace with actual account ID
          description: "Test Product",
          quantity: 1,
          unit_amount: 100,
          tax_rate: "15", // Optional: tax rate as string
        },
      ],
      currency: "SAR" as CurrencyEnum, // Saudi Riyal
      language: "en" as LanguageAc1Enum, // Optional: 'en' or 'ar'
      tax_amount_type: "TAX_EXCLUSIVE" as TaxAmountTypeEnum, // Optional: specify if prices include or exclude tax
    };

    console.log("Request payload:", JSON.stringify(invoiceData, null, 2));
    const invoice = await client.createInvoice(invoiceData);
    console.log(
      "Invoice created successfully:",
      JSON.stringify(invoice, null, 2)
    );
  } catch (error: any) {
    console.error("Error creating invoice:");
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response status:", error.response.status);
      console.error(
        "Response data:",
        JSON.stringify(error.response.data, null, 2)
      );
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    if (error.config) {
      console.error("Request config:", {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers,
        data: error.config.data,
      });
    }
  }
}

// First list contacts and accounts
listContactsAndAccounts().then(() => {
  // Then create invoice
  console.log("\n-----------------------------------\n");
  testCreateInvoice();
});
