import type { AssetRecord } from "@/types/asset";
import type { MarketWatchItem } from "@/types/market-watch-card";
import { mapAssetRecordsToTradingFilterAssets } from "@/lib/utils/map-trading-assets";
import { tradingFilterAssetToWatchlistItem } from "@/lib/utils/watchlist";

export function mapWishlistAssetsToWatchItems(assets: AssetRecord[]): MarketWatchItem[] {
  return mapAssetRecordsToTradingFilterAssets(assets).map(tradingFilterAssetToWatchlistItem);
}
