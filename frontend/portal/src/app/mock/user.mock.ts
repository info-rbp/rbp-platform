import type { MockContact } from "./types.mock";

export interface MockUser {
  id: string;
  role: "guest" | "member" | "admin";
  contact: MockContact;
  membershipStatus: "none" | "trial" | "active" | "pending";
}

export const mockCurrentUser: MockUser = {
  id: "mock-user-001",
  role: "member",
  contact: {
    name: "Pablo Demo",
    email: "pablo.demo@example.com",
    phone: "0400 000 000",
    businessName: "Demo Business Pty Ltd",
  },
  membershipStatus: "active",
};

export const mockGuestUser: MockUser = {
  id: "mock-guest-001",
  role: "guest",
  contact: {
    name: "Guest User",
    email: "guest@example.com",
  },
  membershipStatus: "none",
};
