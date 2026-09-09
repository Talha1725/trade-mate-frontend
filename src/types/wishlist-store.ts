import type { WishlistResponse } from "@/types/wishlist";

export type WishlistStore = {
  wishlistsByAccountNumber: Record<string, WishlistResponse | undefined>;
  setWishlist: (accountNumber: string, wishlist: WishlistResponse) => void;
  clearWishlist: (accountNumber: string) => void;
};
