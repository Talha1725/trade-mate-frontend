"use client";

import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockRecentTrades } from "@/lib/mock-data/orders-recent-trades";
import { cn } from "@/lib/utils";
import type {
  RecentTradeRow,
  RecentTradesTableProps,
} from "@/types/orders-recent-trades";
import { IoArrowDownSharp, IoArrowUpSharp } from "react-icons/io5";

function formatUsdPrice(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatBtcSize(value: number) {
  return value.toFixed(4);
}

function LiveTapeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
      <span className="size-2 animate-pulse rounded-full bg-primary shadow-[0_0_12px_rgba(34,224,162,0.9)]" />
      {label}
    </span>
  );
}

function PriceCell({ trade }: { trade: RecentTradeRow }) {
  const isUp = trade.direction === "up";
  const Icon = isUp ? IoArrowUpSharp : IoArrowDownSharp;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-medium",
        isUp ? "text-primary" : "text-destructive",
      )}
    >
      <span className="text-sm font-medium min-w-[80px]">{formatUsdPrice(trade.price)}</span>
      <Icon className="size-3.5" />
    </span>
  );
}

export function RecentTradesTable({
  title = "Recent Trades",
  liveTapeLabel = "Live Tape",
  trades = mockRecentTrades,
  className,
}: RecentTradesTableProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-6",
        className,
      )}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white md:text-lg">{title}</h3>
        <LiveTapeBadge label={liveTapeLabel} />
      </div>

      <Table>
        <TableHeader variant="gradient">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 px-4 text-sm font-medium text-white/60">
              Price (USD)
            </TableHead>
            <TableHead className="h-11 px-4 text-center text-sm font-medium text-white/60">
              Size (BTC)
            </TableHead>
            <TableHead className="h-11 px-4 text-right text-sm font-medium text-white/60">
              Time
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {trades.map((trade) => (
            <TableRow
              key={trade.id}
              className="border-0 hover:bg-white/5 data-[state=selected]:bg-white/5"
            >
              <TableCell className="px-4 py-2.5">
                <PriceCell trade={trade} />
              </TableCell>
              <TableCell className="px-4 py-2.5 text-center text-sm text-white/60">
                {formatBtcSize(trade.sizeBtc)}
              </TableCell>
              <TableCell className="px-4 py-2.5 text-right text-sm text-white/60">
                {trade.time}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
