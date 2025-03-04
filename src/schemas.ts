import { z } from "zod";
import {
  CurrencyEnum,
  LanguageAc1Enum,
  PlaceOfSupplyEnum,
  Status9b4Enum,
  TaxAmountTypeEnum,
  MediumEnum,
  TypeEnum,
} from "./types";

// Contact schema
export const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxIdentificationNumber: z.string().optional(),
});

// Line item schema
export const LineItemSchema = z.object({
  account: z.string().min(1, "Account is required"),
  cost_center: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  discount: z.number().min(0).optional(),
  item: z.string().optional(),
  quantity: z.number().positive("Quantity must be positive"),
  tax_rate: z.string().optional(),
  unit_amount: z.number().min(0, "Unit amount must be non-negative"),
});

// Credit note schema
export const CreditNoteSchema = z.object({
  amount: z.number().min(0, "Amount must be non-negative"),
  credit_note: z.string().min(1, "Credit note ID is required"),
});

// Invoice create params schema
export const InvoiceCreateParamsSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  invoice_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  invoice_due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  customer: ContactSchema,
  line_items: z
    .array(LineItemSchema)
    .min(1, "At least one line item is required"),
  notes: z.string().optional(),
  currency: z.string(),
  language: z.enum(["ar", "en"]).optional(),
  attachments: z.array(z.string()).optional(),
  branch: z.string().optional(),
  contact: z.string().min(1, "Contact is required"),
  credit_notes: z.array(CreditNoteSchema).optional(),
  place_of_supply: z
    .enum([
      "ABU_DHABI",
      "AJMAN",
      "DUBAI",
      "FUJAIRAH",
      "RAS_AL_KHAIMAH",
      "SHARJAH",
      "UMM_AL_QUWAIN",
      "OUTSIDE_UAE",
    ])
    .optional(),
  project: z.string().optional(),
  reference: z.string().optional(),
  status: z.enum(["DRAFT", "SENT"]).optional(),
  tax_amount_type: z.enum(["TAX_INCLUSIVE", "TAX_EXCLUSIVE"]).optional(),
  warehouse: z.string().optional(),
  discount_account: z.string().optional(),
  discount_amount: z.number().min(0).optional(),
  discount_cost_center: z.string().optional(),
  discount_tax_rate: z.string().optional(),
});

// Invoice response schema
export const InvoiceSchema = z.object({
  id: z.string(),
  invoice_number: z.string(),
  invoice_date: z.string(),
  invoice_due_date: z.string().optional(),
  contact: z.string(),
  currency: z.string(),
  amount: z.number(),
  balance: z.number(),
  tax_amount: z.number(),
  status: z.string().optional(),
  created_ts: z.string(),
  modified_ts: z.string(),
  language: z.enum(["ar", "en"]),
  line_items: z.array(
    z.object({
      id: z.string(),
      account: z.string(),
      description: z.string(),
      quantity: z.number(),
      unit_amount: z.number(),
      line_amount: z.number(),
      tax_amount: z.number(),
      created_ts: z.string(),
      modified_ts: z.string(),
      cost_center: z.string().optional(),
      discount: z.number().optional(),
      item: z.string().optional(),
      tax_rate: z.string().optional(),
    })
  ),
  attachments: z.array(z.string()).optional(),
  branch: z.string().nullable().optional(),
  credit_notes: z
    .array(
      z.object({
        amount: z.number(),
        credit_note: z.string(),
      })
    )
    .optional(),
  discount_account: z.string().optional(),
  discount_amount: z.number().optional(),
  discount_cost_center: z.string().optional(),
  discount_tax_rate: z.string().optional(),
  notes: z.string().optional(),
  place_of_supply: z.string().optional(),
  project: z.string().optional(),
  reference: z.string().optional(),
  tax_amount_type: z.string().optional(),
  warehouse: z.string().optional(),
});

// Bulk Send Invoice schemas
export const BulkSendInvoiceRecipientsSchema = z.object({
  bcc: z.array(z.string().email()).max(6).optional(),
  cc: z.array(z.string().email()).max(6).optional(),
  to: z.array(z.string().email()).max(6),
});

export const BulkSendInvoiceChannelSchema = z.object({
  data: z.object({
    message: z.string(),
    recipients: BulkSendInvoiceRecipientsSchema,
    subject: z.string(),
  }),
  medium: z.nativeEnum(MediumEnum),
});

export const BulkSendInvoiceContactSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string(),
  tax_registration_number: z.string().optional(),
});

export const BulkSendInvoiceLineItemTaxRateSchema = z.object({
  name: z.string(),
  rate: z.number(),
  suid: z.string().optional(),
});

export const BulkSendInvoiceLineItemDiscountSchema = z.object({
  type: z.nativeEnum(TypeEnum),
  value: z.number(),
});

export const BulkSendInvoiceLineItemSchema = z.object({
  account: z.string().optional(),
  description: z.string(),
  discount: BulkSendInvoiceLineItemDiscountSchema.optional(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  tax_rate: BulkSendInvoiceLineItemTaxRateSchema.optional(),
});

export const BulkSendInvoiceParamsSchema = z.object({
  channels: z.array(BulkSendInvoiceChannelSchema),
  contact: BulkSendInvoiceContactSchema,
  currency: z.enum([
    "AED",
    "SAR",
    "USD",
    "EUR",
    "CAD",
    "AFN",
    "ALL",
    "AMD",
    "ARS",
    "AUD",
    "AZN",
    "BAM",
    "BDT",
    "BGN",
    "BHD",
    "BIF",
    "BND",
    "BOB",
    "BRL",
    "BWP",
    "BYN",
    "BZD",
    "CDF",
    "CHF",
    "CLP",
    "CNY",
    "COP",
    "CRC",
    "CVE",
    "CZK",
    "DJF",
    "DKK",
    "DOP",
    "DZD",
    "EGP",
    "ERN",
    "ETB",
    "GBP",
    "GEL",
    "GHS",
    "GNF",
    "GTQ",
    "HKD",
    "HNL",
    "HRK",
    "HUF",
    "IDR",
    "ILS",
    "INR",
    "IQD",
    "IRR",
    "ISK",
    "JMD",
    "JOD",
    "JPY",
    "KES",
    "KHR",
    "KMF",
    "KRW",
    "KWD",
    "KZT",
    "LBP",
    "LKR",
    "LYD",
    "MAD",
    "MDL",
    "MGA",
    "MKD",
    "MMK",
    "MOP",
    "MUR",
    "MXN",
    "MYR",
    "MZN",
    "NAD",
    "NGN",
    "NIO",
    "NOK",
    "NPR",
    "NZD",
    "OMR",
    "PAB",
    "PEN",
    "PHP",
    "PKR",
    "PLN",
    "PYG",
    "QAR",
    "RON",
    "RSD",
    "RUB",
    "RWF",
    "SDG",
    "SEK",
    "SGD",
    "SOS",
    "SYP",
    "THB",
    "TND",
    "TOP",
    "TRY",
    "TTD",
    "TWD",
    "TZS",
    "UAH",
    "UGX",
    "UYU",
    "UZS",
    "VES",
    "VND",
    "XAF",
    "XOF",
    "YER",
    "ZAR",
    "ZMW",
  ]),
  invoice_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  invoice_number: z.string(),
  language: z.enum(["ar", "en"]),
  line_items: z.array(BulkSendInvoiceLineItemSchema).min(1).max(100),
  notes: z.string().optional(),
  paid_through_account: z.string().optional(),
  reference: z.string().optional(),
  tax_amount_type: z.enum(["TAX_INCLUSIVE", "TAX_EXCLUSIVE"]),
});
