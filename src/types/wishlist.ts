import type { AssetRecord } from "@/types/asset";

export type WishlistResponse = {
  assets: AssetRecord[];
};

export type AddToWishlistPayload = {
  assetId: string;
};
