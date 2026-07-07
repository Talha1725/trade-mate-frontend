"use client";

import { IoArrowDownSharp, IoArrowUpSharp } from "react-icons/io5";

import { ResponsiveTableScroll } from "@/components/shared/responsive-table-scroll";
import { TradingSymbolCell } from "@/components/shared/trading-symbol-cell";
import { formatTradingPrice } from "@/components/shared/trading-table-cells";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockRecentTrades } from "@/lib/mock-data/orders-recent-trades";
import { mockStrategyPerformanceRows } from "@/lib/mock-data/strategy-performance";
import { cn } from "@/lib/utils";
import type {
  RecentTradeRow,
  RecentTradesTableProps,
} from "@/types/orders-recent-trades";
import type { StrategyPerformanceRow } from "@/types/strategy-performance";

function formatUsdPrice(value: number, symbol?: string) {
  return `$${formatTradingPrice(value, symbol)}`;
}

function formatSignedCurrency(value: number) {
  const prefix = value >= 0 ? "+" : "-";
  return `${prefix}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatTradeSize(value: number) {
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
      <span className="min-w-[80px] text-sm font-medium">
        {formatUsdPrice(trade.price, trade.symbol)}
      </span>
      <Icon className="size-3.5" />
    </span>
  );
}

function StrategyPerformanceRowCells({ row }: { row: StrategyPerformanceRow }) {
  const pnlTone = row.pnlTone ?? "muted";

  return (
    <TableRow className="border-0 hover:bg-white/5 data-[state=selected]:bg-white/5">
      <TableCell className="w-[22%] px-2 py-3 text-xs font-medium whitespace-normal text-white sm:px-2.5 sm:text-sm">
        <TradingSymbolCell symbol={row.symbol} />
      </TableCell>
      <TableCell
        className={cn(
          "w-[18%] px-2 py-3 text-center text-xs whitespace-normal text-white sm:px-2.5 sm:text-sm",
          pnlTone === "positive" ? "font-medium text-primary" : pnlTone === "negative" ? "font-medium text-destructive" : "text-white",
        )}
      >
        {formatUsdPrice(row.price, row.symbol)}
      </TableCell>
      <TableCell
        className={cn(
          "w-[20%] px-2 py-3 text-center text-xs whitespace-normal sm:px-2.5 sm:text-sm",
          pnlTone === "positive" ? "font-medium text-primary" : pnlTone === "negative" ? "font-medium text-destructive" : "text-white",
        )}
      >
        {formatSignedCurrency(row.pnl)}
      </TableCell>
      <TableCell className="w-[20%] px-2 py-3 text-center text-xs whitespace-normal text-white sm:px-2.5 sm:text-sm">
        {`${row.winRate.toFixed(2)}%`}
      </TableCell>
      <TableCell className="w-[20%] px-2 py-3 text-right text-xs font-medium whitespace-normal text-white/60 sm:px-2.5 sm:text-sm">
        {row.profitFactor.toFixed(2)}
      </TableCell>
    </TableRow>
  );
}

function RecentTradesTableContent({
  trades,
  sizeLabel,
}: {
  trades: RecentTradeRow[];
  sizeLabel: string;
}) {
  return (
    <Table className="min-w-[640px]">
      <TableHeader variant="gradient">
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-11 px-4 text-sm font-medium text-white/60">
            Symbol
          </TableHead>
          <TableHead className="h-11 px-4 text-sm font-medium text-white/60">
            Price (USD)
          </TableHead>
          <TableHead className="h-11 px-4 text-center text-sm font-medium text-white/60">
            Size ({sizeLabel})
          </TableHead>
          <TableHead className="h-11 px-4 text-right text-sm font-medium text-white/60">
            Time
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {trades.length > 0 ? (
          trades.map((trade) => (
            <TableRow
              key={trade.id}
              className="border-0 hover:bg-white/5 data-[state=selected]:bg-white/5"
            >
              <TableCell className="px-4 py-3">
                <TradingSymbolCell symbol={trade.symbol} />
              </TableCell>
              <TableCell className="px-4 py-3">
                <PriceCell trade={trade} />
              </TableCell>
              <TableCell className="px-4 py-3 text-center text-sm text-white/60">
                {formatTradeSize(trade.sizeBtc)}
              </TableCell>
              <TableCell className="px-4 py-3 text-right text-sm text-white/60">
                {trade.time}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="border-0 hover:bg-transparent">
            <TableCell colSpan={4} className="px-4 py-10 text-center text-sm text-white/50">
              Recent trades are not available.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function StrategyPerformanceTableContent({
  strategies,
}: {
  strategies: StrategyPerformanceRow[];
}) {
  return (
    <Table className="w-full table-fixed">
      <TableHeader variant="gradient">
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-11 w-[22%] px-2 text-xs font-medium whitespace-normal text-white/60 sm:px-2.5 sm:text-sm">
            Symbol
          </TableHead>
          <TableHead className="h-11 w-[18%] px-2 text-center text-xs font-medium whitespace-normal text-white/60 sm:px-2.5 sm:text-sm">
            Price
          </TableHead>
          <TableHead className="h-11 w-[20%] px-2 text-center text-xs font-medium whitespace-normal text-white/60 sm:px-2.5 sm:text-sm">
            P&L
          </TableHead>
          <TableHead className="h-11 w-[20%] px-2 text-center text-xs font-medium whitespace-normal text-white/60 sm:px-2.5 sm:text-sm">
            Win Rate
          </TableHead>
          <TableHead className="h-11 w-[20%] px-2 text-right text-xs font-medium whitespace-normal text-white/60 sm:px-2.5 sm:text-sm">
            PF
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {strategies.map((row) => (
          <StrategyPerformanceRowCells key={row.id} row={row} />
        ))}
      </TableBody>
    </Table>
  );
}

export function RecentTradesTable({
  variant = "recent-trades",
  title,
  liveTapeLabel = "Live Tape",
  showHeaderBadge,
  sizeLabel = "BTC",
  trades = mockRecentTrades,
  strategies = mockStrategyPerformanceRows,
  className,
}: RecentTradesTableProps) {
  const isStrategyPerformance = variant === "strategy-performance";
  const resolvedTitle =
    title ?? (isStrategyPerformance ? "Strategy Performance" : "Recent Trades");
  const shouldShowHeaderBadge = showHeaderBadge ?? !isStrategyPerformance;

  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-6",
        className,
      )}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white md:text-lg">
          {resolvedTitle}
        </h3>
        {shouldShowHeaderBadge ? <LiveTapeBadge label={liveTapeLabel} /> : null}
      </div>

      <ResponsiveTableScroll
        className={cn(
          isStrategyPerformance &&
            "**:data-[slot=table-container]:overflow-x-hidden",
        )}
      >
        {isStrategyPerformance ? (
          <StrategyPerformanceTableContent strategies={strategies} />
        ) : (
          <RecentTradesTableContent trades={trades} sizeLabel={sizeLabel} />
        )}
      </ResponsiveTableScroll>
    </section>
  );
}
