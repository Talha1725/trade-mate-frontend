"use client";

import { AppShell } from "@/components/app-shell";
import { ADMIN_NAV_ITEMS } from "@/constant/nav-config";
import type { AdminLayoutProps } from "@/types/admin";
import { RouteGuard } from "@/components/auth/route-guard";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function AdminLayout({ children }: AdminLayoutProps) {
  const adminEmail = useAuthStore((state) => state.session?.user.email);

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
