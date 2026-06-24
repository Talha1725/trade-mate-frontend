export type StrategyPerformancePnlTone = "positive" | "muted";

export type StrategyPerformanceRow = {
  id: string;
  symbol: string;
  pnl: string;
  pnlTone?: StrategyPerformancePnlTone;
  winRate: string;
  profitFactor: string;
};
