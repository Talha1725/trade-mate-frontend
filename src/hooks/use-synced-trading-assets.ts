import * as React from "react";

import { useAssets } from "@/hooks/use-assets";
import { useMarketSelectionStore } from "@/lib/stores/market-selection-store";

export function useSyncedTradingAssets() {
  const syncAssets = useMarketSelectionStore((state) => state.syncAssets);
  const hasHydrated = useMarketSelectionStore((state) => state.hasHydrated);
  const assetsQuery = useAssets();

  React.useEffect(() => {
    if (!hasHydrated || !assetsQuery.data || assetsQuery.data.length === 0) {
      return;
    }

    syncAssets(assetsQuery.data);
  }, [assetsQuery.data, hasHydrated, syncAssets]);

  return assetsQuery;
}
