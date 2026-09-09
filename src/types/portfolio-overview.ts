import type { MarketWatchIcon } from "@/types/market-watch-card";
import type { TradingTimeframe } from "@/types/trading-filter-bar";

export type PortfolioMetricTone = "green" | "orange" | "red" | "blue";

export type PortfolioValuePoint = {
  timestamp: number;
  label: string;
  value: number;
};

export type PortfolioAllocationItem = {
  id: string;
  label: string;
  percent: number;
  value: number;
  color: string;
};

export type PortfolioExposureItem = {
  id: string;
  label: string;
  percent: number;
  iconSrc: string;
  iconTone: "green" | "blue" | "orange";
  fill: string;
};

export type PortfolioTopMoverItem = {
  id: string;
  symbol: string;
  icon: MarketWatchIcon;
  changeAmount: number;
  changePercent: number;
};

export type PortfolioSummary = {
  accountSize: number;
  walletBalance: number;
  equity: number;
  floatingPnl: number;
  availableMargin: number;
  marginUsagePercent: number;
  openPositionsCount: number;
  winningPositionsCount: number;
  losingPositionsCount: number;
  winRate: number;
  riskLabel: "Low" | "Medium" | "High";
  riskTone: PortfolioMetricTone;
  profitTarget: {
    baseBalance: number;
    targetAmount: number;
    currentProfit: number;
    remaining: number;
    progressPercent: number;
  };
};

export type PortfolioChartResponse = {
  defaultTimeframe: TradingTimeframe;
  dataByTimeframe: Partial<Record<TradingTimeframe, PortfolioValuePoint[]>>;
};

export type V2PortfolioSummaryResponse = {
  accountId: string;
  currency: string;
  accountSize: number;
  challenge: {
    plan: string;
    label: string;
    profitTargetPercent: number;
    progressPercent: number;
    reached: boolean;
  } | null;
  balance: number;
  equity: number;
  floatingPnl: number;
  marginUsed: number;
  availableMargin: number;
  marginUsagePercent: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  openTrades: number;
  winningTrades: number;
  losingTrades: number;
  closedTrades: number;
  realizedPnl: number;
  winRate: number;
};

export type V2PortfolioAllocationResponse = {
  accountId: string;
  equity: number;
  invested: number;
  cash: number;
  items: {
    category: "CRYPTO" | "FOREX" | "COMMODITIES" | "INDICES" | "STOCK" | "CASH";
    value: number;
    percent: number;
    trades: number;
  }[];
};

export type V2PortfolioChartRange = "1D" | "1W" | "1M" | "3M";

export type V2PortfolioChartResponse = {
  accountId: string;
  range: V2PortfolioChartRange;
  from: string;
  to: string;
  points: {
    at: string;
    balance: number;
    equity: number;
    floatingPnl: number;
  }[];
};

export type PortfolioOverviewResponse = {
  accountId: string;
  accountNumber: string | null;
  fundingType: string | null;
  generatedAt: string;
  summary: PortfolioSummary;
  chart: PortfolioChartResponse;
  allocation: {
    items: PortfolioAllocationItem[];
  };
  exposure: {
    badgeLabel: string;
    items: PortfolioExposureItem[];
  };
  topMovers: {
    items: PortfolioTopMoverItem[];
  };
};
