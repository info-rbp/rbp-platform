import type { MockApiResponse } from "../services/mock/mockClient";

export type PortalProductKey =
  | "membership"
  | "decision-desk"
  | "docushare"
  | "connectivity"
  | "marketplace-listing"
  | "marketplace-offer"
  | "risk-advisor"
  | "the-fixer";

export type PortalActivityStatus =
  | "draft"
  | "in-progress"
  | "submitted"
  | "in-review"
  | "assigned"
  | "outcome-ready"
  | "active"
  | "published"
  | "payment-required"
  | "payment-complete";

export interface PortalProductActivity {
  id: string;
  product: PortalProductKey;
  title: string;
  description: string;
  status: PortalActivityStatus;
  reference?: string;
  href: string;
  adminHref?: string;
  nextAction: string;
  updatedAt: string;
}

export interface PortalNotification {
  id: string;
  title: string;
  message: string;
  status: PortalActivityStatus;
  href: string;
}

export interface PortalCustomerAuthUser {
  id: string;
  name: string;
  email: string;
  businessName?: string;
}

export interface PortalAdminAuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

export interface PortalDashboardState {
  membershipStatus: "none" | "pending" | "active";
  membershipPlan: string;
  customer: PortalCustomerAuthUser;
  activities: PortalProductActivity[];
  notifications: PortalNotification[];
}

export interface PendingAccountIntent {
  label: string;
  returnTo: string;
  sourcePath: string;
  product?: PortalProductKey;
  createdAt: string;
}

export interface AuthService {
  getCurrentUser(): PortalCustomerAuthUser | null;
  signIn(payload: { email: string; password: string }): Promise<MockApiResponse<PortalCustomerAuthUser>>;
  signUp(payload: { name: string; email: string; businessName?: string }): Promise<MockApiResponse<PortalCustomerAuthUser>>;
  signOut(): Promise<MockApiResponse<{ signedOut: true }>>;
  isAuthenticated(): boolean;
}

export interface AdminAuthService {
  getCurrentAdmin(): PortalAdminAuthUser | null;
  signIn(payload: { email: string; password: string }): Promise<MockApiResponse<PortalAdminAuthUser>>;
  signOut(): Promise<MockApiResponse<{ signedOut: true }>>;
  isAuthenticated(): boolean;
}

export interface PortalService {
  getDashboard(): Promise<MockApiResponse<PortalDashboardState>>;
  recordActivity(payload: Omit<PortalProductActivity, "id" | "updatedAt"> & { id?: string }): Promise<MockApiResponse<PortalProductActivity>>;
  listMyActivity(): Promise<MockApiResponse<PortalProductActivity[]>>;
}

export interface MembershipService {
  createCheckout(payload: Record<string, unknown>): Promise<MockApiResponse<unknown>>;
  completeOnboarding(payload: Record<string, unknown>): Promise<MockApiResponse<unknown>>;
  getStatus(): Promise<MockApiResponse<PortalDashboardState["membershipStatus"]>>;
}

export interface DecisionDeskService {
  createDraft(payload: Record<string, unknown>): Promise<MockApiResponse<PortalProductActivity>>;
  updateDraft(id: string, payload: Record<string, unknown>): Promise<MockApiResponse<PortalProductActivity>>;
  submitRequest(id: string): Promise<MockApiResponse<PortalProductActivity>>;
  listMyRequests(): Promise<MockApiResponse<PortalProductActivity[]>>;
  getRequest(id: string): Promise<MockApiResponse<PortalProductActivity | null>>;
}

export interface DocuShareService {
  createDraft(payload: Record<string, unknown>): Promise<MockApiResponse<PortalProductActivity>>;
  updateDraft(id: string, payload: Record<string, unknown>): Promise<MockApiResponse<PortalProductActivity>>;
  submitBrief(id: string): Promise<MockApiResponse<PortalProductActivity>>;
  listMyBriefs(): Promise<MockApiResponse<PortalProductActivity[]>>;
  getBrief(id: string): Promise<MockApiResponse<PortalProductActivity | null>>;
}

export interface ConnectivityService {
  checkAvailability(payload: Record<string, unknown>): Promise<MockApiResponse<unknown>>;
  createOrderDraft(payload: Record<string, unknown>): Promise<MockApiResponse<PortalProductActivity>>;
  submitOrder(id: string): Promise<MockApiResponse<PortalProductActivity>>;
  listMyOrders(): Promise<MockApiResponse<PortalProductActivity[]>>;
}

export interface MarketplaceService {
  createListingDraft(payload: Record<string, unknown>): Promise<MockApiResponse<PortalProductActivity>>;
  submitListing(id: string): Promise<MockApiResponse<PortalProductActivity>>;
  createOffer(payload: Record<string, unknown>): Promise<MockApiResponse<PortalProductActivity>>;
  listMyListings(): Promise<MockApiResponse<PortalProductActivity[]>>;
  listMyOffers(): Promise<MockApiResponse<PortalProductActivity[]>>;
}

export interface RiskAdvisorService {
  createAssessmentDraft(payload: Record<string, unknown>): Promise<MockApiResponse<PortalProductActivity>>;
  submitAssessment(id: string): Promise<MockApiResponse<PortalProductActivity>>;
  listMyAssessments(): Promise<MockApiResponse<PortalProductActivity[]>>;
}

export interface FixerService {
  createRequestDraft(payload: Record<string, unknown>): Promise<MockApiResponse<PortalProductActivity>>;
  submitRequest(id: string): Promise<MockApiResponse<PortalProductActivity>>;
  listMyRequests(): Promise<MockApiResponse<PortalProductActivity[]>>;
}

export interface AdminService {
  listDashboardQueues(): Promise<MockApiResponse<unknown>>;
  updateRecordStatus(id: string, payload: Record<string, unknown>): Promise<MockApiResponse<unknown>>;
}
