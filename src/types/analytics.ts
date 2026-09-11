import type { ChallengeProgressCardProps } from "@/types/challenge-progress-card";
import type { PortfolioMetricCard } from "@/types/portfolio-metric-card";
import type { PortfolioValueChartTimeframe } from "@/types/portfolio-value-chart";
import type { PortfolioValuePoint } from "@/types/portfolio-value-chart";
import type { TradingCalendarCardProps } from "@/types/trading-calendar-card";
import type { StrategyPerformanceRow } from "@/types/strategy-performance";

export type V2AnalyticsPerformanceRange = "1W" | "1M" | "3M";

export type V2AnalyticsChallengeProgress = {
  plan: string;
  label: string;
  baseBalance: number;
  profitTarget: {
    percent: number;
    amount: number;
    current: number;
    remaining: number;
    progressPercent: number;
    reached: boolean;
  };
  maxDrawdown: {
    percent: number;
    amount: number;
    used: number;
    remaining: number;
    usedPercent: number;
  };
  dailyLoss: {
    percent: number;
    amount: number;
    used: number;
    remaining: number;
  } | null;
  breaches: {
    count: number;
    lastAt: string | null;
  };
};

export type V2AnalyticsOverviewResponse = {
  accountId: string;
  accountNumber: string;
  currency: string;
  accountSize: number;
  balance: number;
  equity: number;
  floatingPnl: number;
  marginUsed: number;
  challenge: V2AnalyticsChallengeProgress | null;
  drawdown: {
    peakEquity: number;
    current: number;
    currentPercent: number;
    max: number;
    maxPercent: number;
  };
  trades: {
    total: number;
    open: number;
    closed: number;
    wins: number;
    losses: number;
    winRate: number;
    profitFactor: number | null;
    netPnl: number;
    grossProfit: number;
    grossLoss: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
  };
  bySymbol: {
    symbol: string;
    trades: number;
    wins: number;
    winRate: number;
    netPnl: number;
  }[];
};

export type V2AnalyticsPerformanceResponse = {
  accountId: string;
  range: V2AnalyticsPerformanceRange;
  from: string;
  to: string;
  points: {
    at: string;
    equity: number;
    balance: number;
    realizedPnl: number;
    trades: number;
  }[];
};

export type AnalyticsEquityCurve = {
  defaultTimeframe: PortfolioValueChartTimeframe;
  dataByTimeframe: Partial<Record<PortfolioValueChartTimeframe, PortfolioValuePoint[]>>;
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
