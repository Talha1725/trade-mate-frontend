"use client";

import type { AccountMetricsSummary } from "@/types";
import type { PortfolioAccount } from "@/types/dashboard";
import type { V2DashboardOverview, V2Trade } from "@/types/v2-dashboard";

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

function startOfUtcDay(date = new Date()) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function getClosedAtTime(trade: Pick<V2Trade, "closedAt">) {
  if (!trade.closedAt) {
    return null;
  }

  const time = new Date(trade.closedAt).getTime();
  return Number.isNaN(time) ? null : time;
}

export function buildAccountMetricsSummaryFromV2(
  overview: V2DashboardOverview,
  closedTrades: V2Trade[],
  now = new Date(),
): AccountMetricsSummary {
  const todayStart = startOfUtcDay(now);
  const last30DaysStart = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  const bestAssetBySymbol = new Map<string, { symbol: string; pnl: number; tradeCount: number }>();
  let dailyPnl = 0;

  for (const trade of closedTrades) {
    const closedAt = getClosedAtTime(trade);
    if (closedAt == null) {
      continue;
    }

    const pnl = toNumber(trade.pnl);

    if (closedAt >= todayStart) {
      dailyPnl += pnl;
    }

    if (closedAt >= last30DaysStart) {
      const current = bestAssetBySymbol.get(trade.symbol) ?? {
        symbol: trade.symbol,
        pnl: 0,
        tradeCount: 0,
      };

      current.pnl += pnl;
      current.tradeCount += 1;
      bestAssetBySymbol.set(trade.symbol, current);
    }
  }

  const bestAsset = Array.from(bestAssetBySymbol.values())
    .sort((left, right) => right.pnl - left.pnl)[0] ?? null;

  return {
    accountId: overview.account.id,
    accountNumber: overview.account.accountNumber ?? null,
    fundingType: overview.summary.challenge?.plan ?? null,
    name: overview.account.name || "Account",
    balance: overview.summary.balance,
    equity: overview.summary.equity,
    floatingPnl: overview.summary.floatingPnl,
    dailyPnl,
    winRate: overview.summary.winRate,
    bestAsset,
  };
}
