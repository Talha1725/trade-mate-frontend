export type MarketSelectionStoreState = {
  selectedMarketId: string;
};

export type MarketSelectionStoreActions = {
  setSelectedMarketId: (marketId: string) => void;
};

export type MarketSelectionStore = MarketSelectionStoreState & MarketSelectionStoreActions;
