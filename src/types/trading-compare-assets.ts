import type { MarketWatchIcon } from "@/types/market-watch-card";

export type CompareAssetItem = {
  id: string;
  symbol: string;
  name: string;
  icon: MarketWatchIcon;
};

export type CompareAssetsDropdownProps = {
  items: CompareAssetItem[];
  primaryAssetId: string;
  compareAssetId?: string | null;
  onCompareChange?: (assetId: string | null) => void;
  className?: string;
};
