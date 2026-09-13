import type { ReactNode } from "react";
import type { LoginFormValues, UserRole } from "@/types/auth";

export type AuthPageShellProps = {
  children: ReactNode;
};

export type AuthenticationBoundaryProps = {
  children: ReactNode;
};

export type LoginFormProps = {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
  redirectTo?: string;
  className?: string;
};

export type RouteGuardProps = {
  children: ReactNode;
  requiredRole?: UserRole;
};
