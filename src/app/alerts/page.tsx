"use client";

import * as React from "react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { terminalApi } from "@/lib/services/terminal.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { mapPortfolioPositionToPosition } from "@/lib/utils/trader-data";
import { SymbolSearch } from "@/components/terminal/symbol-search";
import { TradingChart } from "@/components/terminal/trading-chart";
import { OrderTicket } from "@/components/terminal/order-ticket";
import { OpenPositionsTable } from "@/components/terminal/open-positions-table";
import type { MarketQuoteResponse, MarketSymbolResponse } from "@/types/market";
import type { UserPortfolioResponse } from "@/types/dashboard";
import type { Position } from "@/types/trade";

export default function TerminalPage() {
  const [snapshot, setSnapshot] = React.useState<UserPortfolioResponse | null>(null);
  const [symbols, setSymbols] = React.useState<MarketSymbolResponse["symbols"]>([]);
  const [quotes, setQuotes] = React.useState<MarketQuoteResponse["quotes"]>([]);
  const [historyClose, setHistoryClose] = React.useState<number | null>(null);
  const [selectedSymbol, setSelectedSymbol] = React.useState("EURUSD");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const token = useAuthStore((state) => state.session?.token ?? null);

  React.useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const [snapshotResponse, symbolResponse] = await Promise.all([
          terminalApi.getOpenPositions(token),
          terminalApi.getMarketSymbols(),
        ]);

        if (!isMounted) {
          return;
        }

        setSnapshot(snapshotResponse);
        setSymbols(symbolResponse.symbols);

        const initialSymbol =
          snapshotResponse.positions[0]?.symbol ?? symbolResponse.symbols[0]?.displaySymbol ?? "EURUSD";
        setSelectedSymbol(initialSymbol);
      } catch {
        if (isMounted) {
          setSnapshot(null);
          setSymbols([]);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  React.useEffect(() => {
    if (!token || !selectedSymbol) {
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const quoteResponse = await terminalApi.getMarketQuotes([selectedSymbol], token);

        if (!isMounted) {
          return;
        }

        setQuotes(quoteResponse.quotes);
      } catch {
        if (isMounted) {
          setQuotes([]);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedSymbol, token]);

  React.useEffect(() => {
    if (!selectedSymbol) {
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const historyResponse = await terminalApi.getMarketHistory(selectedSymbol);

        if (!isMounted) {
          return;
        }

        const lastCandle = historyResponse.candles.at(-1);
        setHistoryClose(lastCandle?.close ?? null);
      } catch {
        if (isMounted) {
          setHistoryClose(null);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedSymbol]);

  const accountId = snapshot?.account.id;
  const selectedQuote = quotes[0];
  const availableSymbols = symbols.map((item) => item.displaySymbol);
  const openPositions = snapshot?.positions.map(mapPortfolioPositionToPosition) ?? [];

  const refreshSnapshot = React.useCallback(async () => {
    if (!token) {
      return;
    }

    const updatedSnapshot = await terminalApi.getOpenPositions(token);
    setSnapshot(updatedSnapshot);
  }, [token]);

  React.useEffect(() => {
    window.addEventListener("trade-mate:positions-changed", refreshSnapshot);
    return () => window.removeEventListener("trade-mate:positions-changed", refreshSnapshot);
  }, [refreshSnapshot]);

  const handleSubmitOrder = React.useCallback(
    async (payload: {
      accountId: string;
      symbol: string;
      direction: "BUY" | "SELL";
      lots: number;
      stopLoss?: number | null;
      takeProfit?: number | null;
    }) => {
      if (!token) {
        return;
      }

      setIsSubmitting(true);

      try {
        await terminalApi.placeOrder(payload, token);
        window.dispatchEvent(new Event("trade-mate:positions-changed"));
        await refreshSnapshot();
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshSnapshot, token],
  );

  const handleClosePosition = React.useCallback(
    async (position: Position) => {
      if (!token) {
        return;
      }

      setIsSubmitting(true);

      try {
        await terminalApi.closeTrade({ positionId: position.ticket }, token);
        window.dispatchEvent(new Event("trade-mate:positions-changed"));
        await refreshSnapshot();
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshSnapshot, token],
  );

  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <PageHeader title="Terminal" description="Place trades, view charts, and manage positions." />

        <div className="flex flex-col gap-6 w-full">
          <SymbolSearch
            symbol={selectedSymbol}
            price={selectedQuote?.price ?? historyClose ?? undefined}
            symbols={availableSymbols}
            onSymbolChange={setSelectedSymbol}
          />

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="flex flex-col lg:col-span-8">
              <TradingChart symbol={selectedSymbol} />
            </div>

            <div className="flex flex-col lg:col-span-4">
              <OrderTicket
                accountId={accountId}
                symbol={selectedSymbol}
                price={selectedQuote?.price ?? historyClose ?? undefined}
                onSubmit={handleSubmitOrder}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          <OpenPositionsTable
            positions={openPositions}
            onClosePosition={snapshot?.positions.length ? handleClosePosition : undefined}
          />
        </div>
      </div>
    </AppShell>
  );
}
