export type SymbolBreakdownDatum = {
  name: string;
  value: number;
};

export type EquityCurveDatum = {
  name: string;
  equity: number;
};

export type PositionSummary = {
  symbol: string;
  type: "Buy" | "Sell";
  volume: number;
  profit: number;
};

export type RecentActivityItem = {
  symbol: string;
  action: string;
  price: number;
  dateLabel: string;
};

export type StatCardDatum = {
  title: string;
  value: string;
  description: string;
  tone?: "success";
};

export type PortfolioDirection = "BUY" | "SELL";

export type PortfolioStatus = "OPEN" | "CLOSED";

export type PortfolioAccount = {
  id: string;
  userId: string;
  name: string;
  type: string;
  status: string;
  balance: string;
  equity: string;
  floatingPnl: string;
  marginUsed: string;
  currency: string;
};

export type PortfolioPosition = {
  id: string;
  accountId: string;
  symbol: string;
  internalSymbol: string;
  direction: PortfolioDirection;
  lots: string;
  entryPrice: string;
  currentPrice: string | null;
  stopLoss: string | null;
  takeProfit: string | null;
  openedAt: string;
  closedAt: string | null;
  status: PortfolioStatus;
  floatingPnl: string;
  realizedPnl: string | null;
  source: string;
  tradeId: string | null;
};

export type UserPortfolioResponse = {
  account: PortfolioAccount;
  positions: PortfolioPosition[];
};
