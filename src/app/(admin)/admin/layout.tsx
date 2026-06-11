"use client";

import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { ADMIN_NAV_ITEMS } from "@/constant/nav-config";
import type { AdminLayoutProps } from "@/types/admin";
import { RouteGuard } from "@/components/auth/route-guard";

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [adminEmail, setAdminEmail] = React.useState("admin@trademate.app");

  React.useEffect(() => {
    const stored = localStorage.getItem("user_email") || localStorage.getItem("admin_email");
    if (stored) {
      setAdminEmail(stored);
    } else if (process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      setAdminEmail(process.env.NEXT_PUBLIC_ADMIN_EMAIL);
    }
  }, []);

  return (
    <RouteGuard requiredRole="admin">
      <AppShell navItems={ADMIN_NAV_ITEMS} userLabel={adminEmail}>
        <div className="flex w-full flex-col gap-2">
          {children}
        </div>
      </AppShell>
    </RouteGuard>
  );
}
