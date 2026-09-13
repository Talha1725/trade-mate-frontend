import { useQuery } from "@tanstack/react-query";

import { assetsApi } from "@/lib/services/assets.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { mapAssetRecordsToTradingFilterAssets } from "@/lib/utils/map-trading-assets";

export function useAssets() {
  const token = useAuthStore((state) => state.session?.token ?? null);

  return useQuery({
    queryKey: ["assets"],
    enabled: !!token,
    queryFn: () => assetsApi.getAssets(),
    select: (response) => mapAssetRecordsToTradingFilterAssets(response.assets),
  });
}
