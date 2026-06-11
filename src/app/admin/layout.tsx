import { AppShell } from "@/components/app-shell";
import { PRIMARY_NAV_ITEMS } from "@/constant/nav-config";
import type { AdminLayoutProps } from "@/types/admin";

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AppShell navItems={PRIMARY_NAV_ITEMS} userLabel="admin@trademate.app">
      <div className="flex w-full flex-col gap-2">
        {children}
      </div>
    </AppShell>
  );
}
