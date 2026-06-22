"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { PiDownloadFill } from "react-icons/pi";
import { TrophyIcon, ClockIcon } from "lucide-react";
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { MARKET_WATCH_ICON_IMAGES } from "@/lib/mock-data/market-watch-card";
import { formatMarketPrice } from "@/lib/utils/market-price";
import { formatDateTimeLabel } from "@/lib/utils/trader-data";
import { cn } from "@/lib/utils";
import type { TradeHistoryTableProps } from "@/types";
import type { Trade } from "@/types/trade";
import { mockTrades } from "@/lib/mock-data/trades";

// Symbol → coin icon path mapping
const SYMBOL_ICON_MAP: Record<string, string> = {
  BTCUSD: MARKET_WATCH_ICON_IMAGES.bitcoin,
  ETHUSD: MARKET_WATCH_ICON_IMAGES.ethereum,
  SOLUSD: MARKET_WATCH_ICON_IMAGES.solana,
  XRPUSD: MARKET_WATCH_ICON_IMAGES.ripple,
  ADAUSD: MARKET_WATCH_ICON_IMAGES.cardano,
};

function getSymbolIcon(symbol: string): string | null {
  return SYMBOL_ICON_MAP[symbol.toUpperCase()] ?? null;
}

function SymbolCell({ symbol }: { symbol: string }) {
  const icon = getSymbolIcon(symbol);
  return (
    <div className="flex items-center gap-2.5">
      {icon ? (
        <Image
          src={icon}
          alt={symbol}
          width={24}
          height={24}
          unoptimized
          className="shrink-0 object-contain"
        />
      ) : (
        <span className="size-6 rounded-full bg-white/10 shrink-0" />
      )}
      <span className="font-medium text-white">{symbol}</span>
    </div>
  );
}

function SideBadge({ side }: { side: "Buy" | "Sell" }) {
  const isBuy = side === "Buy";
  const Icon = isBuy ? IoIosTrendingUp : IoIosTrendingDown;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-1 py-1 pr-2.5 text-sm font-normal text-white">
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-full",
          isBuy
            ? "bg-linear-to-b from-[#00EB6E] to-[#00853E]"
            : "bg-linear-to-b from-[#EF4444] to-[#980000]",
        )}
      >
        <Icon className="size-3 text-white" />
      </span>
      {isBuy ? "Buy" : "Sell"}
    </span>
  );
}

function PnlCell({ value }: { value: number }) {
  const isPositive = value > 0;
  return (
    <span
      className={cn(
        "font-medium",
        isPositive ? "text-primary" : "text-destructive",
      )}
    >
      {isPositive ? "+" : ""}${value.toFixed(2)}
    </span>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const isClosed = !status || status === "Closed";
  return (
    <span
      className={cn(
        "text-sm font-medium",
        isClosed ? "text-primary" : "text-orange-400",
      )}
    >
      {isClosed ? "Closed" : "Open"}
    </span>
  );
}

export function TradeHistoryTable({ isLoading }: Omit<TradeHistoryTableProps, "trades">) {
  const sourceTrades = mockTrades;

  // Stats derived from trades
  const stats = useMemo(() => {
    const total = sourceTrades.length;
    const winning = sourceTrades.filter((t) => t.profit > 0).length;
    const winRate = total > 0 ? Math.round((winning / total) * 100) : 0;
    return { total, winRate };
  }, [sourceTrades]);

  const handleExport = useCallback(() => {
    if (sourceTrades.length === 0) return;
    const headers = ["Date/Time", "Symbol", "Side", "Type", "Qty", "Entry", "Exit", "P&L", "Status"];
    const rows = sourceTrades.map((t) => [
      t.openedAt ? formatDateTimeLabel(t.openedAt) : t.time,
      t.symbol,
      t.type,
      "Market",
      t.vol,
      t.openP,
      t.closeP,
      t.profit.toFixed(2),
      t.status ?? "Closed",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trade-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [sourceTrades]);

  return (
    <section className="overflow-hidden rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-5">
      {/* Card header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white md:text-lg">
          Trade History
        </h3>

        <div className="flex items-center gap-3">
          {/* Trades count */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#222222] bg-[linear-gradient(180deg,rgba(19,19,21,0.02)_0%,rgba(255,255,255,0.06)_100%)] px-5 py-2.5 text-xs font-medium text-white/60">
            <ClockIcon className="size-3.5" />
            <span className="text-white">{stats.total} trades</span>
          </div>

          {/* Win rate */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#222222] bg-[linear-gradient(180deg,rgba(19,19,21,0.02)_0%,rgba(255,255,255,0.06)_100%)] px-5 py-2.5 text-xs font-medium text-white/60">
            <Image src="/sidebar icons/cup star.svg" alt="win rate" width={14} height={14} className="opacity-60" />
            <span className="text-white">{stats.winRate}% win rate</span>
          </div>

          {/* Export */}
          <button
            type="button" 
            onClick={handleExport}
            className="inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-[#222222] bg-[linear-gradient(180deg,rgba(19,19,21,0.02)_0%,rgba(255,255,255,0.06)_100%)] px-4.5 py-2.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/5"
          >
            <PiDownloadFill className="size-3.5" />
            <span className="text-white">Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading && sourceTrades.length === 0 ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-white/10">
          <div className="flex flex-col items-center gap-3 text-sm text-white/50">
            <Spinner className="size-5" />
            <span>Loading trade history...</span>
          </div>
        </div>
      ) : sourceTrades.length === 0 ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-white/10">
          <p className="text-sm text-white/40">No trades found.</p>
        </div>
      ) : (
        <Table className="min-w-[860px]">
          <TableHeader variant="gradient">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Date/Time</TableHead>
              <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Symbol</TableHead>
              <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Side</TableHead>
              <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Type</TableHead>
              <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Qty</TableHead>
              <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Entry</TableHead>
              <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Exit</TableHead>
              <TableHead className="h-11 px-4 text-sm font-medium text-white/60">P&amp;L</TableHead>
              <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sourceTrades.map((trade: Trade) => (
              <TableRow
                key={trade.id}
                className="border-white/10 border-b-0! hover:bg-white/5 data-[state=selected]:bg-white/5"
              >
                <TableCell className="px-4 py-3 text-sm text-white/60">
                  {trade.openedAt ? formatDateTimeLabel(trade.openedAt) : trade.time}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <SymbolCell symbol={trade.symbol} />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <SideBadge side={trade.type} />
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-white/60">
                  Market
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-white/60 font-medium">
                  {Number(trade.vol).toFixed(4)}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-white/60 font-medium">
                  {formatMarketPrice(trade.openP, trade.symbol)}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-white/60 font-medium">
                  {formatMarketPrice(trade.closeP, trade.symbol)}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <PnlCell value={trade.profit} />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <StatusBadge status={trade.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
