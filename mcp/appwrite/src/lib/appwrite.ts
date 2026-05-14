import "dotenv/config";
import { Client, Databases, Storage, Functions, Users, Teams } from "node-appwrite";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? "8787"),
  mcpAuthToken: required("MCP_AUTH_TOKEN"),
  endpoint: required("APPWRITE_ENDPOINT"),
  projectId: required("APPWRITE_PROJECT_ID"),
  apiKey: required("APPWRITE_API_KEY"),
  databaseId: process.env.APPWRITE_DATABASE_ID ?? "rbp_platform",
  collections: {
    products: process.env.APPWRITE_PRODUCTS_COLLECTION_ID ?? "products",
    productPrices: process.env.APPWRITE_PRODUCT_PRICES_COLLECTION_ID ?? "product_prices",
    serviceRequests: process.env.APPWRITE_SERVICE_REQUESTS_COLLECTION_ID ?? "service_requests",
    applicationInterests: process.env.APPWRITE_APPLICATION_INTERESTS_COLLECTION_ID ?? "application_interests",
    subscriptions: process.env.APPWRITE_SUBSCRIPTIONS_COLLECTION_ID ?? "subscriptions",
    paymentEvents: process.env.APPWRITE_PAYMENT_EVENTS_COLLECTION_ID ?? "payment_events",
    entitlements: process.env.APPWRITE_ENTITLEMENTS_COLLECTION_ID ?? "entitlements",
    notifications: process.env.APPWRITE_NOTIFICATIONS_COLLECTION_ID ?? "notifications",
    auditLogs: process.env.APPWRITE_AUDIT_LOGS_COLLECTION_ID ?? "mcp_audit_logs"
  }
};

export const client = new Client().setEndpoint(config.endpoint).setProject(config.projectId).setKey(config.apiKey);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const users = new Users(client);
export const teams = new Teams(client);
