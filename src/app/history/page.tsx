"use client";

import * as React from "react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { TradeHistoryTable } from "@/components/history/trade-history-table";
import { dashboardApi } from "@/lib/services/dashboard.api";
import { historyApi } from "@/lib/services/history.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { AccountLedgerResponse } from "@/types/dashboard";
import { usePriceStream } from "@/hooks/use-price-stream";
import type { PriceSocketPortfolioMessage } from "@/types/price";
import { mapLedgerTrades } from "@/lib/utils/trader-data";

export default function HistoryPage() {
  const [ledger, setLedger] = React.useState<AccountLedgerResponse | null>(null);
  const [accountId, setAccountId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const token = useAuthStore((state) => state.session?.token ?? null);

  React.useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const loadAccount = async () => {
      try {
        const snapshot = await dashboardApi.getPortfolioSnapshot(token);

        if (isMounted) {
          setAccountId(snapshot.account.id);
        }
      } catch {
        // Keep the last loaded history visible if the account lookup fails.
      }
    };

    void loadAccount();

    return () => {
      isMounted = false;
    };
  }, [token]);

  React.useEffect(() => {
    if (!token || !accountId) {
      return;
    }

    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const refreshLedger = async () => {
      try {
        const accountLedger = await historyApi.getAccountLedger(accountId, token);

        if (isMounted) {
          setLedger(accountLedger);
        }
      } catch {
        // Keep the last loaded trade history visible if a refresh fails.
      } finally {
        if (isMounted) {
          setIsLoading(false);
          timeoutId = setTimeout(() => {
            void refreshLedger();
          }, 2500);
        }
      }
    };

    void refreshLedger();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [token, accountId]);

  const accountSymbols = React.useMemo(
    () =>
      Array.from(
        new Set(
          (ledger?.positions ?? [])
            .filter((position) => position.status === "OPEN")
            .map((position) => position.symbol),
        ),
      ),
    [ledger?.positions],
  );

  usePriceStream({
    enabled: !!token && !!accountId,
    symbols: accountSymbols,
    accountIds: accountId ? [accountId] : [],
    onPortfolio: (payload: PriceSocketPortfolioMessage) => {
      const account = payload.accounts[0];

      if (!account) {
        return;
      }

      setLedger((currentLedger) => ({
        account,
        positions: payload.positions,
        trades: [
          ...(currentLedger?.trades ?? []),
          ...payload.trades.filter(
            (trade) =>
              trade.status === "CLOSED" &&
              !(currentLedger?.trades ?? []).some((currentTrade) => currentTrade.id === trade.id),
          ),
        ],
      }));
    },
  });

  const trades = React.useMemo(() => mapLedgerTrades(ledger ?? undefined), [ledger]);

  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title="Trade History"
          description="Review past trades and account performance."
        />

        <TradeHistoryTable trades={trades} isLoading={isLoading && !ledger} />
      </div>
    </AppShell>
  );
}
