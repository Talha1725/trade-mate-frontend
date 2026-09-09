import type {
  AccountLedgerResponse,
  PortfolioAccount,
  PortfolioPosition,
  PortfolioTrade,
  TradeCloseResponse,
  TradeOpenResponse,
  UserPortfolioResponse,
} from "@/types/dashboard";
import type {
  DashboardOverviewViewModel,
  V2Account,
  V2DashboardOverview,
  V2DashboardWatchlistItem,
  V2OpenTradeResponse,
  V2Trade,
  V2TradeListResponse,
} from "@/types/v2-dashboard";
import type { MarketWatchItem } from "@/types/market-watch-card";

export function mapV2Account(account: V2Account): PortfolioAccount {
  return {
    id: account.id,
    userId: account.userId,
    accountNumber: account.accountNumber,
    fundingType: account.fundingType,
    name: account.name,
    type: account.type,
    status: account.status,
    accountSize: account.accountSize ?? account.balance,
    balance: account.balance,
    equity: account.equity,
    floatingPnl: account.floatingPnl,
    marginUsed: account.marginUsed,
    currency: account.currency,
  };
}

export function mapV2TradeToPosition(trade: V2Trade): PortfolioPosition {
  return {
    id: trade.id,
    accountId: trade.accountId,
    symbol: trade.symbol,
    internalSymbol: trade.internalSymbol,
    direction: trade.direction,
    lots: trade.lots,
    entryPrice: trade.entryPrice,
    currentPrice: trade.currentPrice ?? trade.entryPrice,
    stopLoss: trade.stopLoss,
    takeProfit: trade.takeProfit,
    openedAt: trade.openedAt,
    closedAt: trade.closedAt,
    status: trade.status,
    floatingPnl: trade.floatingPnl ?? trade.pnl,
    realizedPnl: trade.status === "CLOSED" ? trade.pnl : null,
    source: trade.source,
    tradeId: trade.id,
  };
}

export function mapV2Trade(trade: V2Trade): PortfolioTrade {
  return {
    id: trade.id,
    accountId: trade.accountId,
    userId: trade.userId,
    symbol: trade.symbol,
    internalSymbol: trade.internalSymbol,
    direction: trade.direction,
    lots: trade.lots,
    entryPrice: trade.entryPrice,
    exitPrice: trade.exitPrice,
    stopLoss: trade.stopLoss,
    takeProfit: trade.takeProfit,
    openedAt: trade.openedAt,
    closedAt: trade.closedAt,
    pnl: trade.pnl,
    status: trade.status,
    exitStatus: trade.exitStatus,
    source: trade.source,
    notes: trade.notes,
    positionId: trade.positionId ?? trade.id,
  };
}

export function getTradesFromV2Response(response: V2TradeListResponse): {
  trades: PortfolioTrade[];
  positions: PortfolioPosition[];
  tradePagination: AccountLedgerResponse["tradePagination"];
} {
  const items = Array.isArray(response) ? response : response.items;
  const total = Array.isArray(response) ? items.length : response.total;
  const page = Array.isArray(response) ? 1 : response.page;
  const limit = Array.isArray(response) ? items.length || 1 : response.limit;

  return {
    trades: items.map(mapV2Trade),
    positions: items.filter((trade) => trade.status === "OPEN").map(mapV2TradeToPosition),
    tradePagination: {
      page,
      limit,
      total,
      pageCount: Math.max(1, Math.ceil(total / Math.max(1, limit))),
    },
  };
}

export function mapV2AccountToPortfolioSnapshot(account: V2Account): UserPortfolioResponse {
  const accountTrades = account.trades ?? [];

  return {
    account: mapV2Account(account),
    positions: accountTrades.filter((trade) => trade.status === "OPEN").map(mapV2TradeToPosition),
  };
}

export function mapV2AccountToLedger(account: V2Account): AccountLedgerResponse {
  const mapped = getTradesFromV2Response(account.trades ?? []);

  return {
    account: mapV2Account(account),
    positions: mapped.positions,
    trades: mapped.trades,
    tradePagination: mapped.tradePagination,
  };
}

export function mapV2CloseResponse(response: {
  closed: V2Trade;
  remaining: V2Trade | null;
  account: PortfolioAccount;
}): TradeCloseResponse {
  return {
    trade: mapV2Trade(response.closed),
    position: response.remaining ? mapV2TradeToPosition(response.remaining) : mapV2TradeToPosition(response.closed),
    account: mapV2Account(response.account),
  };
}

export function mapV2OpenResponse(response: V2OpenTradeResponse): TradeOpenResponse {
  return {
    trade: mapV2Trade(response.trade),
    position: mapV2TradeToPosition(response.trade),
    account: mapV2Account(response.account),
  };
}

function mapDashboardAccount(overview: V2DashboardOverview): PortfolioAccount {
  return {
    id: overview.account.id,
    userId: "",
    accountNumber: overview.account.accountNumber,
    fundingType: overview.summary.challenge?.plan ?? null,
    name: overview.account.name,
    type: overview.account.type,
    status: overview.account.status,
    accountSize: String(overview.summary.accountSize),
    balance: String(overview.summary.balance),
    equity: String(overview.summary.equity),
    floatingPnl: String(overview.summary.floatingPnl),
    marginUsed: String(overview.summary.marginUsed),
    currency: overview.account.currency,
  };
}

function mapDashboardWatchlistItem(item: V2DashboardWatchlistItem): MarketWatchItem {
  return {
    id: item.assetId,
    symbol: item.symbol,
    name: item.label,
    category: item.category,
    price: item.last,
    open: item.open,
    high: item.high,
    low: item.low,
    volume: item.volume,
    change: item.change,
    changePercent: item.changePercent,
  };
}

export function mapV2DashboardOverview(overview: V2DashboardOverview): DashboardOverviewViewModel {
  const account = mapDashboardAccount(overview);
  const openPositions = overview.openTrades.map(mapV2TradeToPosition);
  const trades = [...overview.openTrades, ...overview.recentTrades].map(mapV2Trade);

  return {
    snapshot: {
      account,
      positions: openPositions,
    },
    ledger: {
      account,
      positions: openPositions,
      trades,
      tradePagination: {
        page: 1,
        limit: trades.length || 1,
        total: trades.length,
        pageCount: 1,
      },
    },
    summary: {
      accountSize: overview.summary.accountSize,
      walletBalance: overview.summary.balance,
      equity: overview.summary.equity,
      floatingPnl: overview.summary.floatingPnl,
      availableMargin: overview.summary.availableMargin,
      marginUsagePercent: overview.summary.marginUsagePercent,
      openPositionsCount: overview.summary.openTrades,
      winningPositionsCount: overview.summary.winningTrades,
      losingPositionsCount: overview.summary.losingTrades,
      winRate: overview.summary.winRate,
      riskLabel: overview.summary.riskLevel === "HIGH" ? "High" : overview.summary.riskLevel === "MEDIUM" ? "Medium" : "Low",
      riskTone: overview.summary.riskLevel === "HIGH" ? "red" : overview.summary.riskLevel === "MEDIUM" ? "orange" : "green",
      profitTarget: {
        baseBalance: overview.summary.accountSize,
        targetAmount: overview.summary.challenge
          ? overview.summary.accountSize * (overview.summary.challenge.profitTargetPercent / 100)
          : 0,
        currentProfit: overview.summary.equity - overview.summary.accountSize,
        remaining: overview.summary.challenge
          ? Math.max(0, overview.summary.accountSize * (overview.summary.challenge.profitTargetPercent / 100) - (overview.summary.equity - overview.summary.accountSize))
          : 0,
        progressPercent: overview.summary.challenge?.progressPercent ?? 0,
      },
    },
    watchlistAssets: overview.watchlist.map(mapDashboardWatchlistItem),
    symbols: overview.symbols,
  };
}
