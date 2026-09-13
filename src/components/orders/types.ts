import type { StrategyPerformanceRow } from "@/types/strategy-performance";

export type DepthChartLevel = "100" | "250" | "500";

export type DepthChartPoint = {
  price: number;
  bids: number | null;
  asks: number | null;
};

export type DepthChartCardProps = {
  title?: string;
  assetLabel?: string | null;
  dataByLevel?: Record<DepthChartLevel, DepthChartPoint[]>;
  defaultLevel?: DepthChartLevel;
  priceMin?: number;
  priceMax?: number;
  centerPrice?: number;
  axisTicks?: number[];
  assetClass?: string | null;
  symbol?: string | null;
  isLoading?: boolean;
  className?: string;
};

export type OrdersMetricSubtitleTone = "default" | "positive";

export type OrdersMetricValueTone = "default" | "positive";

export type OrdersMetricIconCard = {
  id: string;
  variant: "icon";
  title: string;
  value: string;
  subtitle?: string;
  subtitleTone?: OrdersMetricSubtitleTone;
  valueTone?: OrdersMetricValueTone;
  iconSrc: string;
};

export type OrdersMetricChartCard = {
  id: string;
  variant: "chart";
  title: string;
  value: string;
  subtitle?: string;
  chartValues: number[];
};

export type OrdersMetricCard = OrdersMetricIconCard | OrdersMetricChartCard;

export type OrdersMetricCardsProps = {
  cards?: OrdersMetricCard[];
  className?: string;
};

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
