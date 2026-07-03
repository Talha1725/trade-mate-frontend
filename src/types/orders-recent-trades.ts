import type { StrategyPerformanceRow } from "@/types/strategy-performance";

export type RecentTradeDirection = "up" | "down";

export type RecentTradeRow = {
  id: string;
  symbol: string;
  price: number;
  direction: RecentTradeDirection;
  sizeBtc: number;
  time: string;
};

export type RecentTradesTableVariant = "recent-trades" | "strategy-performance";

export type RecentTradesTableProps = {
  variant?: RecentTradesTableVariant;
  title?: string;
  liveTapeLabel?: string;
  showHeaderBadge?: boolean;
  sizeLabel?: string;
  trades?: RecentTradeRow[];
  strategies?: StrategyPerformanceRow[];
  className?: string;
};
