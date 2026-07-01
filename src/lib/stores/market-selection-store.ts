"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { mockTradingFilterAssets } from "@/lib/mock-data/trading-filter-bar";
import { DEFAULT_WATCHLIST_ASSET_IDS } from "@/lib/utils/watchlist";
import type { MarketSelectionStore } from "@/types/market-selection-store";

const DEFAULT_SELECTED_MARKET_ID = mockTradingFilterAssets[0]?.id ?? "btcusdt";
const VALID_ASSET_IDS = new Set(mockTradingFilterAssets.map((asset) => asset.id));

function normalizeSelectedMarketId(marketId: string) {
  return VALID_ASSET_IDS.has(marketId) ? marketId : DEFAULT_SELECTED_MARKET_ID;
}

function normalizeWatchlistIds(watchlistIds: string[]) {
  const normalized = watchlistIds.filter((assetId) => VALID_ASSET_IDS.has(assetId));

  return normalized.length > 0 ? normalized : [...DEFAULT_WATCHLIST_ASSET_IDS];
}

export const useMarketSelectionStore = create<MarketSelectionStore>()(
  persist(
    (set, get) => ({
      selectedMarketId: DEFAULT_SELECTED_MARKET_ID,
      watchlistIds: [...DEFAULT_WATCHLIST_ASSET_IDS],
      hasHydrated: false,
      setSelectedMarketId: (marketId) =>
        set({ selectedMarketId: normalizeSelectedMarketId(marketId) }),
      toggleWatchlistAsset: (assetId) => {
        if (!VALID_ASSET_IDS.has(assetId)) {
          return;
        }

        const currentWatchlistIds = get().watchlistIds;

        set({
          watchlistIds: currentWatchlistIds.includes(assetId)
            ? currentWatchlistIds.filter((id) => id !== assetId)
            : [...currentWatchlistIds, assetId],
        });
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "trade-mate-market-selection",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedMarketId: state.selectedMarketId,
        watchlistIds: state.watchlistIds,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }

        state.selectedMarketId = normalizeSelectedMarketId(state.selectedMarketId);
        state.watchlistIds = normalizeWatchlistIds(state.watchlistIds);
        state.setHasHydrated(true);
      },
    },
  ),
);
