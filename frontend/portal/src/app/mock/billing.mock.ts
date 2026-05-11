import type { MockMoney, MockPaymentStatus } from "./types.mock";

export interface MockBillingRecord {
  id: string;
  reference: string;
  description: string;
  amount: MockMoney;
  paymentStatus: MockPaymentStatus;
  relatedFlow: string;
}

export const mockBillingRecords: MockBillingRecord[] = [
  {
    id: "billing-001",
    reference: "BILL-PREVIEW-001",
    description: "RBP Premium Membership payment preview",
    amount: {
      amount: 100,
      currency: "AUD",
      gstIncluded: false,
      label: "$100 + GST",
    },
    paymentStatus: "simulated-success",
    relatedFlow: "membership",
  },
];

export const mockPaymentMethods = [
  {
    id: "mock-card",
    label: "Card preview",
    description: "Payment preview only. No real payment is processed.",
  },
  {
    id: "mock-invoice",
    label: "Invoice preview",
    description: "Invoice preview only. No real invoice is created.",
  },
];
