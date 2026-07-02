import type { MarketWatchIcon } from "@/types/market-watch-card";
import type { TradingTimeframe } from "@/types/trading-filter-bar";

export type PortfolioMetricTone = "green" | "orange" | "red" | "blue";

export type PortfolioValuePoint = {
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
