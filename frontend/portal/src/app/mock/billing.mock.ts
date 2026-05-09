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
    reference: "BILL-MOCK-001",
    description: "Mock membership payment simulation",
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
    label: "Mock credit card",
    description: "Frontend-only payment simulation. No real payment is processed.",
  },
  {
    id: "mock-invoice",
    label: "Mock invoice",
    description: "Frontend-only invoice simulation.",
  },
];
