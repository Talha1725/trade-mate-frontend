import type { MarketWatchIcon } from "@/types/market-watch-card";

export type TradingSymbolCellProps = {
  symbol: string;
  icon?: MarketWatchIcon | null;
  className?: string;
};
