"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { RouteGuardProps } from "@/types";

export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const status = useAuthStore((state) => state.status);
  const loadSession = useAuthStore((state) => state.loadSession);
  const isCheckingSession = status === "idle" || status === "loading";
  const isAuthorized = Boolean(
    session && (!requiredRole || session.user.role === requiredRole),
  );

  React.useEffect(() => {
    if (status === "idle") {
      void loadSession();
    }
  }, [loadSession, status]);

  React.useEffect(() => {
    if (isCheckingSession) {
      return;
    }

    if (!session) {
      router.replace("/login");
      return;
    }

    if (requiredRole && session.user.role !== requiredRole) {
      router.replace("/login");
    }
  }, [isCheckingSession, router, requiredRole, session]);

  if (isCheckingSession || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
