"use client";

import * as React from "react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PRIMARY_NAV_ITEMS } from "@/constant/nav-config";
import { dashboardApi } from "@/lib/services/dashboard.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { buildDashboardData } from "@/lib/utils/trader-data";
import type { AccountLedgerResponse, UserPortfolioResponse } from "@/types/dashboard";
import { EquityChart } from "@/components/dashboard/equity-chart";
import { BreakdownWidgets } from "@/components/dashboard/breakdown-widgets";
import { StatCards } from "@/components/dashboard/stat-cards";
import { OpenPositionsSummary } from "@/components/dashboard/open-positions-summary";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { LiveTradingView } from "@/components/dashboard/live-trading-view";

export default function DashboardPage() {
  const [snapshot, setSnapshot] = React.useState<UserPortfolioResponse | null>(null);
  const [ledger, setLedger] = React.useState<AccountLedgerResponse | null>(null);
  const token = useAuthStore((state) => state.session?.token ?? null);

  React.useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const accountSnapshot = await dashboardApi.getPortfolioSnapshot(token);

        if (!isMounted) {
          return;
        }

        setSnapshot(accountSnapshot);

        const accountLedger = await dashboardApi.getAccountLedger(accountSnapshot.account.id, token);

        if (!isMounted) {
          return;
        }

        setLedger(accountLedger);
      } catch {
        if (isMounted) {
          setSnapshot(null);
          setLedger(null);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const dashboardData = snapshot ? buildDashboardData(snapshot, ledger ?? undefined) : null;
  const liveSymbol = dashboardData?.positions[0]?.symbol;

  return (
    <AppShell navItems={PRIMARY_NAV_ITEMS}>
      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title="Dashboard"
          description="Account overview, equity curve, and trading performance."
        />

        <LiveTradingView
          symbol={liveSymbol}
          positions={dashboardData?.openPositionsSummary}
          recentActivity={dashboardData?.recentActivity}
        />

        <StatCards stats={dashboardData?.statCards} />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <EquityChart data={dashboardData?.equityCurve} />
          </div>
          <div className="md:col-span-1">
            <BreakdownWidgets data={dashboardData?.breakdown} />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <OpenPositionsSummary positions={dashboardData?.openPositionsSummary} />
          <RecentActivity items={dashboardData?.recentActivity} />
        </div>
      </div>
    </AppShell>
  );
}
