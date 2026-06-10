import { LayoutDashboardIcon } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { PRIMARY_NAV_ITEMS } from "../../contant/nav-config";

export default function DashboardPage() {
  return (
    <AppShell navItems={PRIMARY_NAV_ITEMS} userLabel="trader@trademate.app">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PageHeader
          title="Dashboard"
          description="Account overview, equity curve, and trading performance."
          icon={LayoutDashboardIcon}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SectionCard title="Account Balance">
            <p className="text-3xl font-semibold tracking-tight">$12,450.80</p>
            <p className="text-sm text-muted-foreground">
              +2.3% from last month
            </p>
          </SectionCard>

          <SectionCard title="Open Positions">
            <p className="text-3xl font-semibold tracking-tight">4</p>
            <p className="text-sm text-muted-foreground">2 long / 2 short</p>
          </SectionCard>

          <SectionCard title="Today's P&L">
            <p className="text-3xl font-semibold tracking-tight text-emerald-600">
              +$184.20
            </p>
            <p className="text-sm text-muted-foreground">+1.5% today</p>
          </SectionCard>

          <SectionCard title="Win Rate">
            <p className="text-3xl font-semibold tracking-tight">68%</p>
            <p className="text-sm text-muted-foreground">Last 30 trades</p>
          </SectionCard>
        </div>

        <SectionCard title="Recent Activity">
          <p className="text-sm text-muted-foreground">
            No recent trades. Open the terminal to place your first trade.
          </p>
        </SectionCard>
      </div>
    </AppShell>
  );
}
