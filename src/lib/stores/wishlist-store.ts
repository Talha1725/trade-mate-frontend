"use client";

import { create } from "zustand";

import type { WishlistStore } from "@/types/wishlist-store";

export const useWishlistStore = create<WishlistStore>()((set) => ({
  wishlistsByAccountNumber: {},
  setWishlist: (accountNumber, wishlist) =>
    set((state) => ({
      wishlistsByAccountNumber: {
        ...state.wishlistsByAccountNumber,
        [accountNumber]: wishlist,
      },
    })),
  clearWishlist: (accountNumber) =>
    set((state) => {
      const nextWishlists = { ...state.wishlistsByAccountNumber };
      delete nextWishlists[accountNumber];

      return { wishlistsByAccountNumber: nextWishlists };
    }),
}));
