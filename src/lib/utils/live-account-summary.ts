"use client";

import type { AccountMetricsSummary } from "@/types";
import type { PortfolioAccount } from "@/types/dashboard";
import type { V2DashboardOverview } from "@/types/v2-dashboard";

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
    dailyTrades: fallback?.dailyTrades,
    winRate: fallback?.winRate,
    bestAsset: fallback?.bestAsset ?? null,
  };
}

export function buildAccountMetricsSummaryFromV2(overview: V2DashboardOverview): AccountMetricsSummary {
  return {
    accountId: overview.account.id,
    accountNumber: overview.account.accountNumber ?? null,
    fundingType: overview.summary.challenge?.plan ?? null,
    name: overview.account.name || "Account",
    balance: overview.summary.balance,
    equity: overview.summary.equity,
    floatingPnl: overview.summary.floatingPnl,
    dailyPnl: overview.dailyPnl,
    dailyTrades: overview.dailyTrades,
    winRate: overview.winRate30d,
    bestAsset: overview.bestAsset30d,
  };
}
