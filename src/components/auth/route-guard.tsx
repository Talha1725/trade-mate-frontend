"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { RouteGuardProps } from "@/types";

export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const isAuthorized = Boolean(
    session && (!requiredRole || session.user.role === requiredRole),
  );

  React.useEffect(() => {
    if (!session) {
      router.replace("/");
      return;
    }

    if (requiredRole && session.user.role !== requiredRole) {
      router.replace(session.user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [router, requiredRole, session]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
