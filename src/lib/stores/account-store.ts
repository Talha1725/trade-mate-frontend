"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SelectedAccountStore } from "@/types/account-store";

export const useSelectedAccountStore = create<SelectedAccountStore>()(
  persist(
    (set) => ({
      selectedAccountId: null,
      setSelectedAccountId: (selectedAccountId) => set({ selectedAccountId }),
    }),
    {
      name: "trade-mate-selected-account",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
