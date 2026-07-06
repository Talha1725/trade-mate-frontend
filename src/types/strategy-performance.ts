export type StrategyPerformancePnlTone = "positive" | "negative" | "muted";

export type StrategyPerformanceRow = {
  id: string;
  symbol: string;
  price: number;
  pnl: number;
  pnlTone?: StrategyPerformancePnlTone;
  winRate: number;
  profitFactor: number;
};
