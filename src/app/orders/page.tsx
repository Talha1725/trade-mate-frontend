"use client";

import * as React from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { ActiveOrdersTable } from "@/components/orders/active-orders-table";
import { DepthChartCard } from "@/components/orders/depth-chart-card";
import { OrderBookCard } from "@/components/orders/order-book-card";
import { OrdersMetricCards } from "@/components/orders/orders-metric-cards";
import { RecentTradesTable } from "@/components/orders/recent-trades-table";
import { PageHeader } from "@/components/page-header";
import { dashboardApi } from "@/lib/services/dashboard.api";
import { terminalApi } from "@/lib/services/terminal.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { mapPortfolioPositionToActiveOrder, mapPortfolioTradeToRecentTrade } from "@/lib/utils/trader-data";
import type { AccountLedgerResponse, UserPortfolioResponse } from "@/types/dashboard";

export default function OrdersPage() {
  const [snapshot, setSnapshot] = React.useState<UserPortfolioResponse | null>(null);
  const [ledger, setLedger] = React.useState<AccountLedgerResponse | null>(null);
  const token = useAuthStore((state) => state.session?.token ?? null);

  const refreshOrders = React.useCallback(async () => {
    if (!token) return;

    const nextSnapshot = await terminalApi.getOpenPositions(token);
    setSnapshot(nextSnapshot);

    const nextLedger = await dashboardApi.getAccountLedger(nextSnapshot.account.id, token);
    setLedger(nextLedger);
  }, [token]);

  React.useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  React.useEffect(() => {
    window.addEventListener("trade-mate:positions-changed", refreshOrders);
    return () => window.removeEventListener("trade-mate:positions-changed", refreshOrders);
  }, [refreshOrders]);

  const activeOrders = React.useMemo(
    () => snapshot?.positions.map(mapPortfolioPositionToActiveOrder) ?? [],
    [snapshot?.positions],
  );
  const recentTrades = React.useMemo(
    () => (ledger?.trades ?? []).filter((trade) => trade.status === "CLOSED").slice(0, 8).map(mapPortfolioTradeToRecentTrade),
    [ledger?.trades],
  );

  const handleClosePosition = React.useCallback(
    async (positionId: string) => {
      if (!token) return;

      try {
        await terminalApi.closeTrade({ positionId }, token);
        toast.success("Order closed.");
        window.dispatchEvent(new Event("trade-mate:positions-changed"));
        await refreshOrders();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to close order.");
      }
    },
    [refreshOrders, token],
  );

  const handleCloseAll = React.useCallback(async () => {
    if (!token || activeOrders.length === 0) return;

    try {
      await Promise.all(activeOrders.map((order) => terminalApi.closeTrade({ positionId: order.id }, token)));
      toast.success("All active orders closed.");
      window.dispatchEvent(new Event("trade-mate:positions-changed"));
      await refreshOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to close all orders.");
    }
  }, [activeOrders, refreshOrders, token]);

  const handleExport = React.useCallback(() => {
    if (activeOrders.length === 0) return;

    const rows = activeOrders.map((order) =>
      [order.displayId, order.symbol, order.side, order.type, order.qty, order.price].join(","),
    );
    const csv = [["ID", "Symbol", "Side", "Type", "Qty", "Price"].join(","), ...rows].join("\n");
    const blob = new Blob([csv], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "active-orders.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [activeOrders]);

  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title="Orders"
          description="View and manage your open orders."
        />
        {/* grid card  */}
        <OrdersMetricCards />
        {/* 2 grid equal  */}
        <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-2">
          <RecentTradesTable trades={recentTrades} />
          <DepthChartCard />
        </div>
        <OrderBookCard />

        <ActiveOrdersTable
          orders={activeOrders}
          onCancel={handleClosePosition}
          onCloseAll={handleCloseAll}
          onExport={handleExport}
        />
      </div>
    </AppShell>
  );
}
