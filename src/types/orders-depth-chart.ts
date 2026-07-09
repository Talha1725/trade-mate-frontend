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
