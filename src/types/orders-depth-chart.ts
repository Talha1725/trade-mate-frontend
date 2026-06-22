export type DepthChartLevel = "100" | "250" | "500";

export type DepthChartPoint = {
  price: number;
  bids: number | null;
  asks: number | null;
};

export type DepthChartCardProps = {
  title?: string;
  dataByLevel?: Record<DepthChartLevel, DepthChartPoint[]>;
  defaultLevel?: DepthChartLevel;
  className?: string;
};
