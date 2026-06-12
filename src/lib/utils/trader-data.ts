import type {
  AccountLedgerResponse,
  PortfolioPosition,
  PortfolioTrade,
  PortfolioAccount,
  UserPortfolioResponse,
} from "@/types/dashboard";
import type {
  EquityCurveDatum,
  PositionSummary,
  RecentActivityItem,
  StatCardDatum,
  SymbolBreakdownDatum,
} from "@/types/dashboard";
import type { Position, Trade } from "@/types/trade";

function toNumber(value: string | number | null | undefined) {
  if (value == null) {
    return 0;
  }

  return typeof value === "number" ? value : Number(value);
}

function formatMoney(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

function formatDateLabel(dateValue: string | null | undefined) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function mapPortfolioPositionToPosition(position: PortfolioPosition): Position {
  const direction = position.direction === "BUY" ? "Buy" : "Sell";
  const openPrice = toNumber(position.entryPrice);
  const currentPrice = toNumber(position.currentPrice ?? position.entryPrice);

  return {
    ticket: position.id,
    symbol: position.symbol,
    type: direction,
    volume: toNumber(position.lots),
    openPrice,
    sl: position.stopLoss ? toNumber(position.stopLoss) : null,
    tp: position.takeProfit ? toNumber(position.takeProfit) : null,
    current: currentPrice,
    profit: toNumber(position.floatingPnl),
  };
}

export function mapPortfolioTradeToTrade(trade: PortfolioTrade): Trade {
  const direction = trade.direction === "BUY" ? "Buy" : "Sell";
  const closePrice = trade.exitPrice ? toNumber(trade.exitPrice) : toNumber(trade.entryPrice);

  return {
    id: trade.id,
    symbol: trade.symbol,
    type: direction,
    vol: toNumber(trade.lots),
    openP: toNumber(trade.entryPrice),
    closeP: closePrice,
    profit: toNumber(trade.pnl),
    time: formatDateLabel(trade.closedAt ?? trade.openedAt),
  };
}

export function buildOpenPositionSummary(positions: PortfolioPosition[]): PositionSummary[] {
  return positions.map((position) => ({
    symbol: position.symbol,
    type: position.direction === "BUY" ? "Buy" : "Sell",
    volume: toNumber(position.lots),
    profit: toNumber(position.floatingPnl),
  }));
}

export function buildRecentActivity(trades: PortfolioTrade[]): RecentActivityItem[] {
  return [...trades]
    .sort((left, right) => {
      const leftDate = new Date(left.closedAt ?? left.openedAt).getTime();
      const rightDate = new Date(right.closedAt ?? right.openedAt).getTime();
      return rightDate - leftDate;
    })
    .slice(0, 5)
    .map((trade) => ({
      symbol: trade.symbol,
      action: trade.closedAt ? `Close ${trade.direction === "BUY" ? "Buy" : "Sell"}` : trade.direction === "BUY" ? "Buy" : "Sell",
      price: toNumber(trade.exitPrice ?? trade.entryPrice),
      dateLabel: formatDateLabel(trade.closedAt ?? trade.openedAt),
    }));
}

export function buildEquityCurve(account: PortfolioAccount, trades: PortfolioTrade[]): EquityCurveDatum[] {
  const closedTrades = [...trades]
    .filter((trade) => trade.closedAt)
    .sort((left, right) => new Date(left.closedAt ?? left.openedAt).getTime() - new Date(right.closedAt ?? right.openedAt).getTime());

  if (closedTrades.length === 0) {
    return [
      { name: "Start", equity: toNumber(account.balance) },
      { name: "Now", equity: toNumber(account.equity) },
    ];
  }

  let runningEquity = toNumber(account.balance);

  const points = closedTrades.map((trade, index) => {
    runningEquity += toNumber(trade.pnl);

    return {
      name: formatDateLabel(trade.closedAt ?? trade.openedAt) || `T${index + 1}`,
      equity: Number(runningEquity.toFixed(2)),
    };
  });

  return points.slice(-7);
}

export function buildSymbolBreakdown(positions: PortfolioPosition[]): SymbolBreakdownDatum[] {
  const totals = new Map<string, number>();

  for (const position of positions) {
    const current = totals.get(position.symbol) ?? 0;
    totals.set(position.symbol, current + Math.max(Math.abs(toNumber(position.floatingPnl)), toNumber(position.lots)));
  }

  return Array.from(totals.entries()).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2)),
  }));
}

export function buildStatCards(account: PortfolioAccount, positions: PortfolioPosition[], trades: PortfolioTrade[]): StatCardDatum[] {
  const closedTrades = trades.filter((trade) => trade.status === "CLOSED");
  const winners = closedTrades.filter((trade) => toNumber(trade.pnl) > 0).length;
  const winRate = closedTrades.length > 0 ? Math.round((winners / closedTrades.length) * 100) : 0;

  return [
    {
      title: "Account Balance",
      value: formatMoney(toNumber(account.balance)),
      description: `${formatMoney(toNumber(account.equity) - toNumber(account.balance))} floating`,
    },
    {
      title: "Open Positions",
      value: String(positions.length),
      description: `${positions.filter((position) => position.direction === "BUY").length} long / ${positions.filter((position) => position.direction === "SELL").length} short`,
    },
    {
      title: "Today's P&L",
      value: formatMoney(positions.reduce((sum, position) => sum + toNumber(position.floatingPnl), 0)),
      description: `${formatMoney(toNumber(account.floatingPnl))} account floating`,
      tone: "success",
    },
    {
      title: "Win Rate",
      value: `${winRate}%`,
      description: `${closedTrades.length} closed trades`,
    },
  ];
}

export function buildDashboardData(snapshot: UserPortfolioResponse, ledger?: AccountLedgerResponse) {
  const account = ledger?.account ?? snapshot.account;
  const positions = ledger?.positions ?? snapshot.positions;
  const trades = ledger?.trades ?? [];

  return {
    account,
    positions,
    trades,
    statCards: buildStatCards(account, positions, trades),
    equityCurve: buildEquityCurve(account, trades),
    breakdown: buildSymbolBreakdown(positions),
    openPositionsSummary: buildOpenPositionSummary(positions),
    recentActivity: buildRecentActivity(trades),
  };
}

export function mapSnapshotPositions(snapshot: UserPortfolioResponse) {
  return snapshot.positions.map(mapPortfolioPositionToPosition);
}

export function mapLedgerTrades(ledger?: AccountLedgerResponse) {
  return ledger?.trades?.map(mapPortfolioTradeToTrade) ?? [];
}
