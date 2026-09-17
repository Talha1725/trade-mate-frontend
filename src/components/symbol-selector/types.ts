import type { TradingFilterBarAsset } from "@/types/trading-filter-bar";

export type SymbolSelectorProps = {
  className?: string;
  contentClassName?: string;
  triggerLabel?: string;
  onWishlistToggle?: (asset: TradingFilterBarAsset, nextIsInWatchlist: boolean) => void;
};
