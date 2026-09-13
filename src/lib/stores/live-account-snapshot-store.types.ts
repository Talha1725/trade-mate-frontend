import type { AccountMetricsSummary } from "@/types/trade";

export type LiveAccountSnapshotStore = {
  summariesByAccountId: Record<string, AccountMetricsSummary>;
  openOrderCountsByAccountId: Record<string, number>;
  setAccountSummary: (summary: AccountMetricsSummary) => void;
  setOpenOrderCount: (accountId: string, count: number) => void;
  clearAccountSnapshot: (accountId?: string | null) => void;
};
