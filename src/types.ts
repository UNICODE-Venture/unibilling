export interface WafeqConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface Contact {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxIdentificationNumber?: string;
}

export interface InvoiceItem {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  discount?: number;
}

/**
 * Line item for invoice creation as per API documentation
 */
export interface LineItem {
  account: string; // Required: The account associated with this line item
  cost_center?: string; // The cost center associated with this line item
  description: string; // Required: The detailed description of the line item
  discount?: number; // The discount as the percentage (0 to 10000000000000000000)
  item?: string; // The item associated with this line item
  quantity: number; // Required: The quantity of the item or service
  tax_rate?: string; // The tax rate applied to this line item
  unit_amount: number; // Required: The price per unit of the item or service
}

export interface CreditNote {
  amount: number; // Required: The amount of the credit note applied to the invoice
  credit_note: string; // Required: The unique identifier of the credit note
}

export type CurrencyEnum =
  | "AED" // د.إ.‏
  | "SAR" // ر.س.‏
  | "USD" // $
  | "EUR" // €
  | "CAD" // $
  | "AFN" // ؋
  | "ALL" // Lek
  | "AMD" // դր.
  | "ARS" // $
  | "AUD" // $
  | "AZN" // ман.
  | "BAM" // KM
  | "BDT" // ৳
  | "BGN" // лв.
  | "BHD" // د.ب.‏
  | "BIF" // FBu
  | "BND" // $
  | "BOB" // Bs
  | "BRL" // R$
  | "BWP" // P
  | "BYN" // BYN
  | "BZD" // $
  | "CDF" // FrCD
  | "CHF" // CHF
  | "CLP" // $
  | "CNY" // CN¥
  | "COP" // $
  | "CRC" // ₡
  | "CVE" // CV$
  | "CZK" // Kč
  | "DJF" // Fdj
  | "DKK" // kr
  | "DOP" // RD$
  | "DZD" // د.ج.‏
  | "EGP" // ج.م.‏
  | "ERN" // Nfk
  | "ETB" // Br
  | "GBP" // £
  | "GEL" // GEL
  | "GHS" // GH₵
  | "GNF" // FG
  | "GTQ" // Q
  | "HKD" // $
  | "HNL" // L
  | "HRK" // kn
  | "HUF" // Ft
  | "IDR" // Rp
  | "ILS" // ₪
  | "INR" // ₹
  | "IQD" // د.ع.‏
  | "IRR" // ﷼
  | "ISK" // kr
  | "JMD" // $
  | "JOD" // د.أ.‏
  | "JPY" // ￥
  | "KES" // Ksh
  | "KHR" // ៛
  | "KMF" // FC
  | "KRW" // ₩
  | "KWD" // د.ك.‏
  | "KZT" // тңг.
  | "LBP" // ل.ل.‏
  | "LKR" // SL Re
  | "LYD" // د.ل.‏
  | "MAD" // د.م.‏
  | "MDL" // MDL
  | "MGA" // MGA
  | "MKD" // MKD
  | "MMK" // K
  | "MOP" // MOP$
  | "MUR" // MURs
  | "MXN" // $
  | "MYR" // RM
  | "MZN" // MTn
  | "NAD" // N$
  | "NGN" // ₦
  | "NIO" // C$
  | "NOK" // kr
  | "NPR" // नेरू
  | "NZD" // $
  | "OMR" // ر.ع.‏
  | "PAB" // B/.
  | "PEN" // S/.
  | "PHP" // ₱
  | "PKR" // ₨
  | "PLN" // zł
  | "PYG" // ₲
  | "QAR" // ر.ق.‏
  | "RON" // RON
  | "RSD" // дин.
  | "RUB" // руб.
  | "RWF" // FR
  | "SDG" // SDG
  | "SEK" // kr
  | "SGD" // $
  | "SOS" // Ssh
  | "SYP" // ل.س.‏
  | "THB" // ฿
  | "TND" // د.ت.‏
  | "TOP" // T$
  | "TRY" // TL
  | "TTD" // $
  | "TWD" // NT$
  | "TZS" // TSh
  | "UAH" // ₴
  | "UGX" // USh
  | "UYU" // $
  | "UZS" // UZS
  | "VES" // Bs.S.
  | "VND" // ₫
  | "XAF" // FCFA
  | "XOF" // CFA
  | "YER" // ر.ي.‏
  | "ZAR" // R
  | "ZMW"; // ZK

/**
 * Language options for Wafeq documents
 * ar - Arabic
 * en - English
 */
export type LanguageAc1Enum = "ar" | "en";

/**
 * Place of supply options for UAE organizations
 */
export type PlaceOfSupplyEnum =
  | "ABU_DHABI"
  | "AJMAN"
  | "DUBAI"
  | "FUJAIRAH"
  | "RAS_AL_KHAIMAH"
  | "SHARJAH"
  | "UMM_AL_QUWAIN"
  | "OUTSIDE_UAE";

/**
 * Status options for invoices
 * DRAFT - Default status for new invoices
 * SENT - Status when invoice has been sent to customer
 */
export type Status9b4Enum = "DRAFT" | "SENT";

/**
 * Tax amount type options
 * TAX_INCLUSIVE - Prices include tax
 * TAX_EXCLUSIVE - Prices exclude tax
 */
export type TaxAmountTypeEnum = "TAX_INCLUSIVE" | "TAX_EXCLUSIVE";

export interface InvoiceCreateParams {
  invoice_number: string; // Required: The unique number assigned to this invoice
  invoice_date: string; // Required: The date when the invoice was issued (date format)
  invoice_due_date?: string; // The date by which the invoice should be paid (date format)
  customer: Contact;
  line_items: LineItem[]; // Required: The individual line items included in this invoice
  notes?: string; // Additional notes or comments about the invoice
  currency: CurrencyEnum; // Required: Currency code (e.g., "SAR", "USD", "EUR")
  language?: LanguageAc1Enum; // Default: en
  attachments?: string[]; // Array of strings for files or documents attached to the invoice
  branch?: string; // The branch associated with this invoice
  contact: string; // Required: The contact (customer) associated with this invoice
  credit_notes?: CreditNote[]; // Array of credit notes applied to this invoice

  // Place of supply for UAE organizations
  place_of_supply?: PlaceOfSupplyEnum; // The place of supply for UAE organizations

  // Project and reference fields
  project?: string; // The project associated with this invoice, if applicable
  reference?: string; // An optional reference number or code for this invoice

  // Status field
  status?: Status9b4Enum; // The status of the invoice (defaults to DRAFT)

  // Tax amount type field
  tax_amount_type?: TaxAmountTypeEnum; // Whether prices include or exclude tax

  // Warehouse field
  warehouse?: string; // The warehouse associated with this invoice, if applicable

  // Discount related fields
  discount_account?: string; // The account to which the discount will be booked, if applicable
  discount_amount?: number; // The discount amount to apply to the invoice (0 to 10000000000000000)
  discount_cost_center?: string; // The cost center associated with the discount, if applicable
  discount_tax_rate?: string; // The tax rate applied to the discount, if applicable
}

export interface Invoice {
  /**
   * The total amount of the invoice, including taxes.
   * Range: -10000000000000000000 to 10000000000000000000
   */
  amount: number;

  /**
   * Any files or documents attached to this invoice.
   */
  attachments?: string[];

  /**
   * The remaining balance of the invoice.
   * Range: -10000000000000000000 to 10000000000000000000
   */
  balance: number;

  /**
   * The branch associated with this invoice.
   */
  branch?: string | null;

  /**
   * The contact (customer) associated with this invoice.
   */
  contact: string;

  /**
   * The timestamp in UTC when the invoice was created.
   */
  created_ts: string;

  /**
   * The credit notes applied to this invoice.
   */
  credit_notes?: Array<{
    /**
     * The amount of the credit note applied to the invoice.
     * Range: -10000000000000000000 to 10000000000000000000
     */
    amount: number;

    /**
     * The unique identifier of the credit note applied to the invoice.
     */
    credit_note: string;
  }>;

  /**
   * The currency used for the invoice.
   * Supported currencies include AED, SAR, USD, EUR, CAD, and many others.
   */
  currency: string;

  /**
   * The account to which the discount will be booked, if applicable.
   */
  discount_account?: string;

  /**
   * The discount amount to apply to the invoice.
   * Range: 0 to 10000000000000000000
   */
  discount_amount?: number;

  /**
   * The cost center associated with the discount, if applicable.
   */
  discount_cost_center?: string;

  /**
   * The tax rate applied to the discount, if applicable.
   */
  discount_tax_rate?: string;

  /**
   * The unique identifier of the invoice.
   */
  id: string;

  /**
   * The date when the invoice was issued.
   */
  invoice_date: string;

  /**
   * The date by which the invoice should be paid.
   */
  invoice_due_date?: string;

  /**
   * The unique number assigned to this invoice.
   */
  invoice_number: string;

  /**
   * The language of the invoice.
   */
  language: LanguageAc1Enum;

  /**
   * The individual line items included in this invoice.
   */
  line_items: Array<{
    account: string;
    cost_center?: string;
    created_ts: string;
    description: string;
    discount?: number;
    id: string;
    item?: string;
    line_amount: number;
    modified_ts: string;
    quantity: number;
    tax_amount: number;
    tax_rate?: string;
    unit_amount: number;
  }>;

  modified_ts: string;
  notes?: string;
  place_of_supply?: PlaceOfSupplyEnum;
  project?: string;
  reference?: string;
  status?: Status9b4Enum;
  tax_amount: number;
  tax_amount_type?: TaxAmountTypeEnum;
  warehouse?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ApiError extends Error {
  status?: number;
  data?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export enum MediumEnum {
  EMAIL = "Email",
}

export enum TypeEnum {
  PERCENT = "%",
  AMOUNT = "amount",
}

export interface BulkSendInvoiceRecipients {
  bcc?: string[];
  cc?: string[];
  to: string[];
}

export interface BulkSendInvoiceChannel {
  data: {
    message: string;
    recipients: BulkSendInvoiceRecipients;
    subject: string;
  };
  medium: MediumEnum;
}

export interface BulkSendInvoiceContact {
  address?: string;
  city?: string;
  country?: string;
  email?: string;
  name: string;
  tax_registration_number?: string;
}

export interface BulkSendInvoiceLineItemTaxRate {
  name: string;
  rate: number;
  suid?: string;
}

export interface BulkSendInvoiceLineItemDiscount {
  type: TypeEnum;
  value: number;
}

export interface BulkSendInvoiceLineItem {
  account?: string;
  description: string;
  discount?: BulkSendInvoiceLineItemDiscount;
  name: string;
  price: number;
  quantity: number;
  tax_rate?: BulkSendInvoiceLineItemTaxRate;
}

export interface BulkSendInvoiceParams {
  channels: BulkSendInvoiceChannel[];
  contact: BulkSendInvoiceContact;
  currency: CurrencyEnum;
  invoice_date: string;
  invoice_number: string;
  language: LanguageAc1Enum;
  line_items: BulkSendInvoiceLineItem[];
  notes?: string;
  paid_through_account?: string;
  reference?: string;
  tax_amount_type: TaxAmountTypeEnum;
}
