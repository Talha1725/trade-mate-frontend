import type { MarketWatchIcon } from "@/types/market-watch-card";

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
