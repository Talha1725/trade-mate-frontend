"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SelectedAccountStore } from "@/types/account-store";

export const useSelectedAccountStore = create<SelectedAccountStore>()(
  persist(
    (set) => ({
      selectedAccountId: null,
      hasHydrated: false,
      setSelectedAccountId: (selectedAccountId) => set({ selectedAccountId }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "trade-mate-selected-account",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedAccountId: state.selectedAccountId }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
