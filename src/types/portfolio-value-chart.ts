import type { TradingTimeframe } from "@/types/trading-filter-bar";

export type PortfolioValueChartTimeframe = TradingTimeframe | "1D" | "1W" | "1M" | "3M";

export type PortfolioValuePoint = {
  timestamp: number;
  label: string;
  value: number;
};

export type PortfolioValueChartProps = {
  title?: string;
  dataByTimeframe?: Partial<Record<PortfolioValueChartTimeframe, PortfolioValuePoint[]>>;
  defaultTimeframe?: PortfolioValueChartTimeframe;
  timeframes?: PortfolioValueChartTimeframe[];
  showExportButton?: boolean;
  exportLabel?: string;
  onExport?: () => void;
  onTimeframeChange?: (timeframe: PortfolioValueChartTimeframe) => void;
  emptyStateMessage?: string;
  className?: string;
};
