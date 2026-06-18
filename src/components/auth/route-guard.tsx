"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { RouteGuardProps } from "@/types";

export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const status = useAuthStore((state) => state.status);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingSession = status === "idle" || status === "loading";
  const isAuthorized = Boolean(
    session && (!requiredRole || session.user.role === requiredRole),
  );

  React.useEffect(() => {
    if (!hasHydrated || isCheckingSession) {
      return;
    }

    if (!session) {
      router.replace("/login");
      return;
    }

    if (requiredRole && session.user.role !== requiredRole) {
      router.replace("/login");
    }
  }, [hasHydrated, isCheckingSession, router, requiredRole, session]);

  if (!hasHydrated || isCheckingSession || !isAuthorized) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        <div className="inline-flex items-center gap-2">
          <Loader2Icon className="size-4 animate-spin" />
          Loading your session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
