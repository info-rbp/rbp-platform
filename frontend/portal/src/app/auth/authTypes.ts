export type AuthRole =
  | "Administrator"
  | "System Manager"
  | "RBP Admin"
  | "Website User"
  | "RBP Member"
  | "RBP Business Owner"
  | "RBP Team Member"
  | "RBP Advisor"
  | "RBP Support Agent";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  status: "authenticated";
  user: AuthUser;
  roles: AuthRole[];
  source: "mock";
  createdAt: string;
}

export type AuthSessionState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | AuthSession;
