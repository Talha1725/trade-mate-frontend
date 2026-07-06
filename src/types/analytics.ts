import type { ChallengeProgressCardProps } from "@/types/challenge-progress-card";
import type { PortfolioMetricCard } from "@/types/portfolio-metric-card";
import type { PortfolioValuePoint } from "@/types/portfolio-value-chart";
import type { TradingTimeframe } from "@/types/trading-filter-bar";
import type { TradingCalendarCardProps } from "@/types/trading-calendar-card";
import type { StrategyPerformanceRow } from "@/types/strategy-performance";

export type AnalyticsEquityCurve = {
  defaultTimeframe: TradingTimeframe;
  dataByTimeframe: Partial<Record<TradingTimeframe, PortfolioValuePoint[]>>;
};

export type AnalyticsChallengeProgress = ChallengeProgressCardProps & {
  accountStatus?: string;
  plan?: {
    planKey: string | null;
    planLabel: string | null;
    leverage: string | null;
    balanceK: number | null;
    priceUsd: number | null;
    baseBalance: number;
    targetAmount: number;
    source: string;
  };
};

export type AnalyticsOverviewResponse = {
  account: {
    id: string;
    userId: string;
    accountNumber: string | null;
    fundingType: string | null;
    name: string;
    type: string;
    status: string;
    balance: string;
    equity: string;
    floatingPnl: string;
    marginUsed: string;
    currency: string;
    openPositionsCount: number;
    createdAt: string;
  };
  statsCards: PortfolioMetricCard[];
  challengeProgress: AnalyticsChallengeProgress;
  equityCurve: AnalyticsEquityCurve;
  calendar: TradingCalendarCardProps;
  strategyPerformance: {
    total: number;
    rows: StrategyPerformanceRow[];
  };
  generatedAt: string;
};
