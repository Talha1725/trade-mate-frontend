export type StrategyPerformancePnlTone = "positive" | "negative" | "muted";

export type StrategyPerformanceRow = {
  id: string;
  symbol: string;
  price: number | null;
  pnl: number;
  pnlTone?: StrategyPerformancePnlTone;
  winRate: number;
  profitFactor: number;
};
