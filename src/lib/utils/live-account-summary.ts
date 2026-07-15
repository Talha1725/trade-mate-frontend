"use client";

import type { AccountMetricsSummary } from "@/types";
import type { PortfolioAccount } from "@/types/dashboard";

function toNumber(value: string | number | null | undefined) {
  if (value == null) {
    return 0;
  }

  return typeof value === "number" ? value : Number(value);
}

export function buildAccountMetricsSummaryFromAccount(
  account: Pick<PortfolioAccount, "id" | "accountNumber" | "fundingType" | "name" | "balance" | "equity" | "floatingPnl" | "marginUsed">,
  fallback?: AccountMetricsSummary | null,
): AccountMetricsSummary {
  return {
    accountId: account.id,
    accountNumber: account.accountNumber ?? fallback?.accountNumber ?? null,
    fundingType: account.fundingType ?? fallback?.fundingType ?? null,
    name: account.name ?? fallback?.name ?? "Account",
    balance: Math.max(0, toNumber(account.balance)),
    equity: toNumber(account.equity),
    floatingPnl: toNumber(account.floatingPnl),
    dailyPnl: fallback?.dailyPnl ?? 0,
    winRate: fallback?.winRate,
    bestAsset: fallback?.bestAsset ?? null,
  };
}
