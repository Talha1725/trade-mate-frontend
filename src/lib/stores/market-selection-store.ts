"use client";

import { create } from "zustand";

import { mockTradingFilterAssets } from "@/lib/mock-data/trading-filter-bar";
import type { MarketSelectionStore } from "@/types/market-selection-store";

export const useMarketSelectionStore = create<MarketSelectionStore>((set) => ({
  selectedMarketId: mockTradingFilterAssets[0]?.id ?? "btcusdt",
  setSelectedMarketId: (marketId) => set({ selectedMarketId: marketId }),
}));
