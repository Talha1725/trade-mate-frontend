"use client";

import { create } from "zustand";

import type { AccountMetricsSummary } from "@/types";

type LiveAccountSnapshotStore = {
  summariesByAccountId: Record<string, AccountMetricsSummary>;
  openOrderCountsByAccountId: Record<string, number>;
  setAccountSummary: (summary: AccountMetricsSummary) => void;
  setOpenOrderCount: (accountId: string, count: number) => void;
  clearAccountSnapshot: (accountId?: string | null) => void;
};

export const useLiveAccountSnapshotStore = create<LiveAccountSnapshotStore>()(
  (set) => ({
    summariesByAccountId: {},
    openOrderCountsByAccountId: {},
    setAccountSummary: (summary) =>
      set((state) => ({
        summariesByAccountId: {
          ...state.summariesByAccountId,
          [summary.accountId]: summary,
        },
      })),
    setOpenOrderCount: (accountId, count) =>
      set((state) => ({
        openOrderCountsByAccountId: {
          ...state.openOrderCountsByAccountId,
          [accountId]: count,
        },
      })),
    clearAccountSnapshot: (accountId) =>
      set((state) => {
        if (!accountId) {
          return {
            summariesByAccountId: {},
            openOrderCountsByAccountId: {},
          };
        }

        const summariesByAccountId = { ...state.summariesByAccountId };
        const openOrderCountsByAccountId = { ...state.openOrderCountsByAccountId };
        delete summariesByAccountId[accountId];
        delete openOrderCountsByAccountId[accountId];

        return {
          summariesByAccountId,
          openOrderCountsByAccountId,
        };
      }),
  }),
);
