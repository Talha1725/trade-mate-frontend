import type React from "react";
import type { ID, ISODateString } from "@/types";

export type UserRole = "trader" | "admin";

export type AuthUser = {
  id: ID;
  email: string;
  name: string;
  role: UserRole;
  createdAt: ISODateString;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
  expiresAt: ISODateString;
};

export type AuthStatus = "idle" | "submitting" | "success" | "error";

export type LoginFormValues = LoginCredentials & {
  rememberMe: boolean;
};

export type AuthStoreState = {
  session: AuthSession | null;
};

export type AuthStoreActions = {
  signIn: (credentials: LoginCredentials) => void;
  signOut: () => void;
};

export type AuthStore = AuthStoreState & AuthStoreActions;

export type RouteGuardProps = {
  children: React.ReactNode;
  requiredRole?: UserRole;
};
