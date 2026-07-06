import type { StrategyPerformanceRow } from "@/types/strategy-performance";

export const mockStrategyPerformanceRows: StrategyPerformanceRow[] = [
  {
    id: "strategy-1",
    symbol: "BTCUSDT",
    price: 69102,
    pnl: 6842,
    pnlTone: "positive",
    winRate: 23.94,
    profitFactor: 2.48,
  },
  {
    id: "strategy-2",
    symbol: "ETHUSDT",
    price: 1571.35,
    pnl: 243,
    pnlTone: "muted",
    winRate: 24.3,
    profitFactor: 2.18,
  },
  {
    id: "strategy-3",
    symbol: "SOLUSDT",
    price: 142.8,
    pnl: 217.5,
    pnlTone: "muted",
    winRate: 21.75,
    profitFactor: 1.92,
  },
  {
    id: "strategy-4",
    symbol: "XRPUSDT",
    price: 0.62,
    pnl: 198.4,
    pnlTone: "muted",
    winRate: 19.84,
    profitFactor: 1.76,
  },
  {
    id: "strategy-5",
    symbol: "ADAUSDT",
    price: 0.45,
    pnl: 182.1,
    pnlTone: "muted",
    winRate: 18.21,
    profitFactor: 1.64,
  },
];
