import * as React from "react";
import { useMutation } from "@tanstack/react-query";

import { wishlistApi } from "@/lib/services/wishlist.api";
import { mapAssetRecordsToTradingFilterAssets } from "@/lib/utils/map-trading-assets";
import { mapWishlistAssetsToWatchItems } from "@/lib/utils/map-wishlist-items";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import type { AssetRecord } from "@/types/asset";
import type { TradingFilterBarAsset } from "@/types/trading-filter-bar";
import type { WishlistResponse } from "@/types/wishlist";

function toWishlistAssetRecord(
  asset: TradingFilterBarAsset,
  sortOrder: number,
): AssetRecord {
  const timestamp = new Date().toISOString();

  return {
    id: asset.id,
    label: asset.label,
    symbol: asset.symbol,
    category: asset.category,
    isActive: true,
    sortOrder,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function useAccountWishlist(
  accountNumber: string | null,
  availableAssets: TradingFilterBarAsset[] = [],
) {
  const token = useAuthStore((state) => state.session?.token ?? null);
  const cachedWishlist = useWishlistStore((state) =>
    accountNumber ? state.wishlistsByAccountNumber[accountNumber] : undefined,
  );
  const setWishlist = useWishlistStore((state) => state.setWishlist);
  const wishlistData = cachedWishlist;

  const wishlistAssets = React.useMemo(
    () => mapAssetRecordsToTradingFilterAssets(wishlistData?.assets ?? []),
    [wishlistData?.assets],
  );

  const wishlistAssetIds = React.useMemo(
    () => wishlistAssets.map((asset) => asset.id),
    [wishlistAssets],
  );

  const watchlistItems = React.useMemo(
    () => mapWishlistAssetsToWatchItems(wishlistData?.assets ?? []),
    [wishlistData?.assets],
  );

  const setWishlistCache = React.useCallback(
    (data: WishlistResponse) => {
      if (!accountNumber) {
        return;
      }

      setWishlist(accountNumber, data);
    },
    [accountNumber, setWishlist],
  );

  const addMutation = useMutation({
    mutationFn: (assetId: string) =>
      wishlistApi.addToWishlist(accountNumber!, { assetId }),
    onMutate: async (assetId) => {
      if (!accountNumber) {
        return;
      }

      const previous = cachedWishlist;
      const asset = availableAssets.find((item) => item.id === assetId);

      if (!previous || !asset || previous.assets.some((item) => item.id === assetId)) {
        return { previous };
      }

      const nextData: WishlistResponse = {
        assets: [
          ...previous.assets,
          toWishlistAssetRecord(asset, previous.assets.length),
        ],
      };

      setWishlist(accountNumber, nextData);

      return { previous };
    },
    onSuccess: (data) => {
      setWishlistCache(data);
    },
    onError: (_error, _assetId, context) => {
      if (!accountNumber || !context?.previous) {
        return;
      }

      setWishlist(accountNumber, context.previous);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (assetId: string) =>
      wishlistApi.removeFromWishlist(accountNumber!, assetId),
    onMutate: async (assetId) => {
      if (!accountNumber) {
        return;
      }

      const previous = cachedWishlist;

      if (!previous) {
        return { previous };
      }

      const nextData = {
        assets: previous.assets.filter((asset) => asset.id !== assetId),
      };

      setWishlist(accountNumber, nextData);

      return { previous };
    },
    onSuccess: (data) => {
      setWishlistCache(data);
    },
    onError: (_error, _assetId, context) => {
      if (!accountNumber || !context?.previous) {
        return;
      }

      setWishlist(accountNumber, context.previous);
    },
  });

  const toggleWishlistAsset = React.useCallback(
    (assetId: string) => {
      if (!accountNumber) {
        return;
      }

      const current = wishlistData;
      const isInWishlist = current?.assets.some((asset) => asset.id === assetId) ?? false;

      if (isInWishlist) {
        removeMutation.mutate(assetId);
        return;
      }

      addMutation.mutate(assetId);
    },
    [accountNumber, addMutation, removeMutation, wishlistData],
  );

  return {
    watchlistItems,
    wishlistAssetIds,
    wishlistAssets,
    toggleWishlistAsset,
    isLoading: !!token && !!accountNumber && !wishlistData,
    isFetching: false,
    isMutating: addMutation.isPending || removeMutation.isPending,
  };
}
