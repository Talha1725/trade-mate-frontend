import type { TradingFilterBarAsset, TradingTimeframe } from "@/types/trading-filter-bar";

export type MarketSelectionStoreState = {
  selectedMarketId: string;
  compareAssetId: string | null;
  timeframe: TradingTimeframe;
  knownAssetIds: string[];
  hasHydrated: boolean;
};

export type MarketSelectionStoreActions = {
  setSelectedMarketId: (marketId: string) => void;
  setCompareAssetId: (assetId: string | null) => void;
  setTimeframe: (timeframe: TradingTimeframe) => void;
  syncAssets: (assets: TradingFilterBarAsset[]) => void;
  setHasHydrated: (value: boolean) => void;
};

export type MarketSelectionStore = MarketSelectionStoreState & MarketSelectionStoreActions;
