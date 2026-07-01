export type MarketSelectionStoreState = {
  selectedMarketId: string;
  watchlistIds: string[];
  hasHydrated: boolean;
};

export type MarketSelectionStoreActions = {
  setSelectedMarketId: (marketId: string) => void;
  toggleWatchlistAsset: (assetId: string) => void;
  setHasHydrated: (value: boolean) => void;
};

export type MarketSelectionStore = MarketSelectionStoreState & MarketSelectionStoreActions;
