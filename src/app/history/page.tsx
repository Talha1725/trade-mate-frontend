"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { TradeHistoryTable } from "@/components/history/trade-history-table";
import { historyApi } from "@/lib/services/history.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useSelectedAccountStore } from "@/lib/stores/account-store";
import type { AccountLedgerResponse } from "@/types/dashboard";
import { usePriceStream } from "@/hooks/use-price-stream";
import type { PriceSocketPortfolioMessage } from "@/types/price";
import { mapLedgerTrades } from "@/lib/utils/trader-data";

export default function HistoryPage() {
  const [ledger, setLedger] = React.useState<AccountLedgerResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const token = useAuthStore((state) => state.session?.token ?? null);
  const selectedAccountId = useSelectedAccountStore((state) => state.selectedAccountId);

  React.useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
  }, [token]);

  React.useEffect(() => {
    const accountId = selectedAccountId;

    if (!token || !accountId) {
      return;
    }

    let isMounted = true;

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
        }
      }
    };

    void refreshLedger();

    return () => {
      isMounted = false;
    };
  }, [selectedAccountId, token]);

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
    enabled: !!token && !!selectedAccountId,
    symbols: accountSymbols,
    accountIds: selectedAccountId ? [selectedAccountId] : [],
    onPortfolio: (payload: PriceSocketPortfolioMessage) => {
      const account = payload.accounts[0];

      if (!account) {
        return;
      }

      setLedger((currentLedger) => ({
        account: {
          ...account,
        },
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
      <div className="flex w-full min-w-0 flex-col gap-6">
        <PageHeader
          title="Trade History"
          description="Review past trades and account performance."
        />
        {isLoading && !ledger ? (
          <div className="flex h-[80vh] w-full items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <TradeHistoryTable trades={trades} isLoading={isLoading && !ledger} />
        )}
      </div>
    </AppShell>
  );
}
