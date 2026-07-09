"use client";

import * as React from "react";

import { useAssets } from "@/hooks/use-assets";
import { useMarketSelectionStore } from "@/lib/stores/market-selection-store";

function getPreferredSymbol(assets: { symbol: string; category: string }[]) {
  return (
    assets.find((asset) => asset.symbol.toUpperCase() === "EURUSD")?.symbol ??
    assets.find((asset) => asset.category === "FOREX")?.symbol ??
    assets[0]?.symbol ??
    null
  );
}

/**
 * The globally-selected trading symbol, derived from the market-selection store's
 * selected asset id + the synced assets list. This is the single source of truth
 * shared by the dashboard, order modal, and navbar so the selection stays in sync.
 */
export function useSelectedSymbol(): string | null {
  const selectedMarketId = useMarketSelectionStore((state) => state.selectedMarketId);
  const { data: assets } = useAssets();

  return React.useMemo(() => {
    if (!assets || assets.length === 0) {
      return null;
    }

    return (
      assets.find((asset) => asset.id === selectedMarketId)?.symbol ??
      getPreferredSymbol(assets)
    );
  }, [assets, selectedMarketId]);
}

/** Set the global selection by symbol (mapped to the underlying asset id). */
export function useSetSelectedSymbol() {
  const setSelectedMarketId = useMarketSelectionStore((state) => state.setSelectedMarketId);
  const { data: assets } = useAssets();

  return React.useCallback(
    (symbol: string) => {
      const asset = assets?.find(
        (candidate) => candidate.symbol.toUpperCase() === symbol.toUpperCase(),
      );

      if (asset) {
        setSelectedMarketId(asset.id);
      }
    },
    [assets, setSelectedMarketId],
  );
}
