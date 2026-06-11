import { AppShell } from "@/components/app-shell";
import { PRIMARY_NAV_ITEMS } from "@/constant/nav-config";
import { PageHeader } from "@/components/page-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell navItems={PRIMARY_NAV_ITEMS} userLabel="admin@trademate.app">
      <div className="flex w-full flex-col gap-2">
        {children}
      </div>
    </AppShell>
  );
}
