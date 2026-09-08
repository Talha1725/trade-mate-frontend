import { del, get, post } from "@/lib/utils/api";
import type { V2WishlistItem } from "@/types/v2-wishlist";
import type { AddToWishlistPayload, WishlistResponse } from "@/types/wishlist";

function wishlistRoute(accountNumber: string) {
  return `/api/wishlist/${encodeURIComponent(accountNumber)}`;
}

function wishlistItemRoute(accountNumber: string, assetId: string) {
  return `${wishlistRoute(accountNumber)}/${encodeURIComponent(assetId)}`;
}

function mapWishlistResponse(response: WishlistResponse | V2WishlistItem[]): WishlistResponse {
  if (!Array.isArray(response)) {
    return response;
  }

  return {
    assets: response.map((item) => item.asset),
  };
}

export const wishlistApi = {
  async getWishlist(accountNumber: string): Promise<WishlistResponse> {
    const response = await get<WishlistResponse | V2WishlistItem[]>(wishlistRoute(accountNumber));
    return mapWishlistResponse(response);
  },

  async addToWishlist(accountNumber: string, payload: AddToWishlistPayload): Promise<WishlistResponse> {
    await post<V2WishlistItem>(wishlistRoute(accountNumber), payload);
    return this.getWishlist(accountNumber);
  },

  async removeFromWishlist(accountNumber: string, assetId: string): Promise<WishlistResponse> {
    await del<null>(wishlistItemRoute(accountNumber, assetId));
    return this.getWishlist(accountNumber);
  },
};
