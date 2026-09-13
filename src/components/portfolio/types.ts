import type { MarketWatchIcon } from "@/types/market-watch-card";

export type GradientHorizontalProgressProps = {
  value: number;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
  trackClassName?: string;
  fill?: string;
};

export type SemiCircleDonutGaugeProps = {
  value: number;
  label?: string;
  className?: string;
  size?: number;
};

export type PortfolioAllocationItem = {
  id: string;
  label: string;
  percent: number;
  value: number;
  color: string;
};

export type PortfolioAllocationCardProps = {
  title?: string;
  items?: PortfolioAllocationItem[];
  backgroundImageSrc?: string;
  className?: string;
};

export type PortfolioExposureIconTone = "green" | "blue" | "orange";

export type PortfolioExposureItem = {
  id: string;
  label: string;
  percent: number;
  iconSrc: string;
  iconTone: PortfolioExposureIconTone;
  fill: string;
};

export type PortfolioExposureBreakdownCardProps = {
  title?: string;
  badgeLabel?: string;
  items?: PortfolioExposureItem[];
  backgroundImageSrc?: string;
  className?: string;
};

export type PortfolioTopMoverItem = {
  id: string;
  symbol: string;
  icon: MarketWatchIcon;
  changeAmount: number;
  changePercent: number;
};

export type PortfolioTopMoversCardProps = {
  title?: string;
  items?: PortfolioTopMoverItem[];
  backgroundImageSrc?: string;
  className?: string;
};

export type SortMode = "percent" | "amount";
