import type { AssetCategory, AssetRecord } from "@/types/asset";
import type { PortfolioAccount, PortfolioTrade, UserPortfolioResponse } from "@/types/dashboard";
import type { PortfolioSummary } from "@/types/portfolio-overview";

export type V2Account = PortfolioAccount & {
  accountSize?: string;
  trades?: V2Trade[];
  assetWishlists?: { id: string; createdAt: string; asset: AssetRecord }[];
};

export type V2Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};

export type V2Trade = Omit<PortfolioTrade, "positionId"> & {
  currentPrice?: string | null;
  floatingPnl?: string;
  positionId?: string | null;
};

export type V2TradeListResponse = V2Paginated<V2Trade> | V2Trade[];

export type V2AccountListResponse = V2Account[] | { accounts: V2Account[] };

export type V2CloseTradeResponse = {
  closed: V2Trade;
  remaining: V2Trade | null;
  account: PortfolioAccount;
};

export type V2OpenTradeResponse = {
  trade: V2Trade;
  account: PortfolioAccount;
};

export type V2DashboardSnapshot = UserPortfolioResponse;

export type V2DashboardWatchlistItem = {
  assetId: string;
  symbol: string;
  label: string;
  category: AssetCategory;
};

export type V2DashboardOverview = {
  account: {
    id: string;
    accountNumber: string;
    name: string;
    type: string;
    status: string;
    currency: string;
  };
  summary: {
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
  openTrades: V2Trade[];
  recentTrades: V2Trade[];
  watchlist: V2DashboardWatchlistItem[];
  symbols: string[];
};

export type DashboardOverviewViewModel = {
  snapshot: UserPortfolioResponse;
  ledger: import("@/types/dashboard").AccountLedgerResponse;
  summary: PortfolioSummary;
  watchlistAssets: AssetRecord[];
  symbols: string[];
};
