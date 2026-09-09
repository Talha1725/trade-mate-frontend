"use client";

import * as React from "react";

import { wishlistApi } from "@/lib/services/wishlist.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";

export function useAccountWishlistPreload(accountNumber?: string | null) {
  const token = useAuthStore((state) => state.session?.token ?? null);
  const cachedWishlist = useWishlistStore((state) =>
    accountNumber ? state.wishlistsByAccountNumber[accountNumber] : undefined,
  );
  const setWishlist = useWishlistStore((state) => state.setWishlist);

  React.useEffect(() => {
    if (!token || !accountNumber || cachedWishlist) {
      return;
    }

    let isActive = true;

    wishlistApi
      .getWishlist(accountNumber)
      .then((wishlist) => {
        if (isActive) {
          setWishlist(accountNumber, wishlist);
        }
      })
      .catch(() => {
        // Wishlist is non-critical UI state; individual consumers can retry.
      });

    return () => {
      isActive = false;
    };
  }, [accountNumber, cachedWishlist, setWishlist, token]);
}
