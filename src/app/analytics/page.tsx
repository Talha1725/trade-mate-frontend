"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { AppShell } from "@/components/app-shell";
import { ChallengeProgressCard } from "@/components/analytics/challenge-progress-card";
import { TradingCalendarCard } from "@/components/analytics/trading-calendar-card";
import { RecentTradesTable } from "@/components/orders/recent-trades-table";
import { PageHeader } from "@/components/page-header";
import { PortfolioMetricCards } from "@/components/portfolio/portfolio-metric-cards";
import { PortfolioValueChart } from "@/components/portfolio/portfolio-value-chart";
import { analyticsApi } from "@/lib/services/analytics.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useSelectedAccountStore } from "@/lib/stores/account-store";
import { useUserAccounts } from "@/hooks/use-user-accounts";
import type { AnalyticsOverviewResponse } from "@/types/analytics";
import type { PortfolioMetricCard } from "@/types/portfolio-metric-card";
import type { PortfolioValuePoint } from "@/types/portfolio-value-chart";
import type { TradingTimeframe } from "@/types/trading-filter-bar";

const ANALYTICS_TIMEFRAMES: TradingTimeframe[] = ["1m", "5m"];

function buildZeroSeries(pointCount = 12): PortfolioValuePoint[] {
  return Array.from({ length: pointCount }, (_value, index) => ({
    label: String(index + 1),
    value: 0,
  }));
}

function buildEmptyAnalyticsOverview(accountId: string | null): AnalyticsOverviewResponse {
  const zeroSeries = buildZeroSeries();
  const zeroMetricCards: PortfolioMetricCard[] = [
    {
      id: "net-pnl",
      variant: "icon-stats",
      title: "Net P&L",
      value: "$0.00",
      valueTone: "default",
      subtitle: "+0.00% this cycle",
      subtitleTone: "default",
      iconKind: "chart-spline",
      iconTone: "green",
      subStats: [
        { label: "Best Day", value: "$0.00" },
        { label: "Avg Day", value: "$0.00" },
      ],
      chartValues: zeroSeries.map((point) => point.value),
    },
    {
      id: "win-rate",
      variant: "gauge-progress",
      title: "Win Rate",
      value: "0.0%",
      subtitle: "0 trades analyzed",
      gaugeValue: 0,
      progressValue: 0,
      progressLeftLabel: "Goal",
      progressRightLabel: "50%+",
    },
    {
      id: "profit-factor",
      variant: "icon-stats",
      title: "Profit Factor",
      value: "0.00",
      subtitle: "Target 2.0+",
      iconKind: "target",
      iconTone: "green",
      subStats: [
        { label: "Gross Profit", value: "$0.00" },
        { label: "Gross Loss", value: "$0.00" },
      ],
    },
    {
      id: "max-drawdown",
      variant: "icon-stats",
      title: "Max Drawdown",
      value: "$0.00",
      valueTone: "default",
      subtitle: "-0.00%",
      subtitleTone: "default",
      iconKind: "trend-down",
      iconTone: "red",
      subStats: [
        { label: "Threshold", value: "$0.00" },
        { label: "Status", value: "Safe", tone: "positive" },
      ],
    },
    {
      id: "consistency",
      variant: "icon-stats",
      title: "Consistency",
      value: "0.0/10",
      subtitle: "Needs Work",
      subtitleTone: "negative",
      iconKind: "target",
      iconTone: "blue",
      subStats: [
        { label: "Green Days", value: "0" },
        { label: "Streak", value: "0 days" },
      ],
    },
    {
      id: "payout",
      variant: "icon-stats",
      title: "Rule Breaches",
      value: "0",
      valueTone: "positive",
      subtitle: "No URFX breach events",
      subtitleTone: "positive",
      iconKind: "trend-down",
      iconTone: "red",
      subStats: [
        { label: "Last Breach", value: "None", tone: "default" },
        { label: "Account Status", value: "Active", tone: "positive" },
      ],
    },
  ];

  return {
    account: {
      id: accountId ?? "",
      userId: "",
      accountNumber: null,
      fundingType: null,
      name: "",
      type: "DEMO",
      status: "ACTIVE",
      balance: "0",
      equity: "0",
      floatingPnl: "0",
      marginUsed: "0",
      currency: "USD",
      openPositionsCount: 0,
      createdAt: new Date().toISOString(),
    },
    statsCards: zeroMetricCards,
    challengeProgress: {
      title: "Challenge Progress",
      statusLabel: "On Track",
      progress: 0,
      progressLabel: "Progress",
      stats: [
        {
          id: "completed",
          label: "Completed",
          valuePrimary: "$0.00",
          valueSecondary: "0.0%",
          tone: "completed",
        },
        {
          id: "remaining",
          label: "Remaining",
          valuePrimary: "$0.00",
          valueSecondary: "100.0%",
          tone: "remaining",
        },
      ],
      message: "Stay consistent to maintain your evaluation progress.",
    },
    equityCurve: {
      defaultTimeframe: "1m",
      dataByTimeframe: {
        "1m": zeroSeries,
        "5m": zeroSeries,
      },
    },
    calendar: {
      title: "Trading Calendar",
      sessionsLabel: "0 Sessions",
      weekdays: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
      days: [],
    },
    strategyPerformance: {
      total: 0,
      rows: [],
    },
    generatedAt: new Date().toISOString(),
  };
}

export default function AnalyticsPage() {
  const token = useAuthStore((state) => state.session?.token ?? null);
  const selectedAccountId = useSelectedAccountStore((state) => state.selectedAccountId);
  const setSelectedAccountId = useSelectedAccountStore((state) => state.setSelectedAccountId);
  const { data: userAccounts } = useUserAccounts();

  const accountListLoaded = userAccounts !== undefined;
  const availableAccounts = userAccounts?.accounts ?? [];

  const resolvedAccountId = React.useMemo(() => {
    if (!accountListLoaded) {
      return null;
    }

    if (selectedAccountId && availableAccounts.some((account) => account.id === selectedAccountId)) {
      return selectedAccountId;
    }

    return availableAccounts[0]?.id ?? null;
  }, [accountListLoaded, availableAccounts, selectedAccountId]);

  React.useEffect(() => {
    if (!accountListLoaded) {
      return;
    }

    if (resolvedAccountId !== selectedAccountId) {
      setSelectedAccountId(resolvedAccountId);
    }
  }, [accountListLoaded, resolvedAccountId, selectedAccountId, setSelectedAccountId]);

  const placeholderOverview = React.useMemo(
    () => buildEmptyAnalyticsOverview(resolvedAccountId),
    [resolvedAccountId],
  );

  const analyticsQuery = useQuery({
    queryKey: ["analytics", resolvedAccountId, token],
    enabled: !!token && !!resolvedAccountId,
    queryFn: () => analyticsApi.getOverview(resolvedAccountId ?? "", token ?? undefined),
    placeholderData: placeholderOverview,
  });

  const analytics = analyticsQuery.data ?? placeholderOverview;

  return (
    <AppShell>
      <div className="flex w-full min-w-0 flex-col gap-6">
        <PageHeader
          title="Analytics"
          description="Review analytics and performance."
        />

        <PortfolioMetricCards
          cards={analytics.statsCards}
          className="md:grid-cols-2 xl:grid-cols-3 min-[1700px]:grid-cols-6!"
        />

        <div className="grid grid-cols-1 items-stretch gap-5 md:gap-6 xl:grid-cols-10 2xl:grid-cols-10 min-[1800px]:grid-cols-10">
          <div className="flex min-h-0 xl:col-span-5 2xl:col-span-5 min-[1800px]:col-span-4!">
            <ChallengeProgressCard
              className="w-full"
              {...analytics.challengeProgress}
            />
          </div>

          <div className="flex min-h-0 xl:col-span-5 2xl:col-span-5 min-[1800px]:col-span-6!">
            <PortfolioValueChart
              title="Equity Curve"
              dataByTimeframe={analytics.equityCurve.dataByTimeframe}
              timeframes={ANALYTICS_TIMEFRAMES}
              defaultTimeframe={analytics.equityCurve.defaultTimeframe}
              showExportButton
              emptyStateMessage="No equity curve data available."
              className="h-[400px] w-full xl:h-auto"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:gap-6 xl:grid-cols-3">
          <TradingCalendarCard {...analytics.calendar} />
          <div className="xl:col-span-2 2xl:col-span-2 min-[1800px]:col-span-1!">
            <RecentTradesTable
              variant="strategy-performance"
              strategies={analytics.strategyPerformance.rows}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
