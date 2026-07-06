import type { StrategyPerformanceRow } from "@/types/strategy-performance";

export const mockStrategyPerformanceRows: StrategyPerformanceRow[] = [
  {
    id: "strategy-1",
    symbol: "BTCUSDT",
    pnl: "+$6,842",
    pnlTone: "positive",
    winRate: "0.2394",
    profitFactor: "2.48",
  },
  {
    id: "strategy-2",
    symbol: "ETHUSDT",
    pnl: "0.2430",
    pnlTone: "muted",
    winRate: "0.2430",
    profitFactor: "2.18",
  },
  {
    id: "strategy-3",
    symbol: "SOLUSDT",
    pnl: "0.2175",
    pnlTone: "muted",
    winRate: "0.2175",
    profitFactor: "1.92",
  },
  {
    id: "strategy-4",
    symbol: "BNBUSDT",
    pnl: "0.1984",
    pnlTone: "muted",
    winRate: "0.1984",
    profitFactor: "1.76",
  },
  {
    id: "strategy-5",
    symbol: "XRPUSDT",
    pnl: "0.1821",
    pnlTone: "muted",
    winRate: "0.1821",
    profitFactor: "1.64",
  },
];
