import type { TradingTimeframe } from "@/types/trading-filter-bar";

export type PortfolioValuePoint = {
  label: string;
  value: number;
};

export type PortfolioValueChartProps = {
  title?: string;
  dataByTimeframe?: Partial<Record<TradingTimeframe, PortfolioValuePoint[]>>;
  defaultTimeframe?: TradingTimeframe;
  timeframes?: TradingTimeframe[];
  showExportButton?: boolean;
  exportLabel?: string;
  onExport?: () => void;
  emptyStateMessage?: string;
  className?: string;
};
