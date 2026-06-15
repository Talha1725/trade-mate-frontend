"use client";

import * as React from "react";
import { DownloadIcon } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PRIMARY_NAV_ITEMS } from "../../constant/nav-config";
import { Button } from "@/components/ui/button";
import { TradeHistoryTable } from "@/components/history/trade-history-table";
import { dashboardApi } from "@/lib/services/dashboard.api";
import { historyApi } from "@/lib/services/history.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { mapPortfolioTradeToTrade } from "@/lib/utils/trader-data";
import type { AccountLedgerResponse } from "@/types/dashboard";

export default function HistoryPage() {
  const [ledger, setLedger] = React.useState<AccountLedgerResponse | null>(null);
  const token = useAuthStore((state) => state.session?.token ?? null);

  React.useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const snapshot = await dashboardApi.getPortfolioSnapshot(token);
        const accountLedger = await historyApi.getAccountLedger(snapshot.account.id, token);

        if (isMounted) {
          setLedger(accountLedger);
        }
      } catch {
        if (isMounted) {
          setLedger(null);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const trades = ledger?.trades?.map(mapPortfolioTradeToTrade);

  return (
    <AppShell navItems={PRIMARY_NAV_ITEMS}>
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <PageHeader
            title="Trade History"
            description="Review past trades and account performance."
          />
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <TradeHistoryTable trades={trades} />
      </div>
    </AppShell>
  );
}
