"use client";

import Image from "next/image";
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import { PiDownloadFill } from "react-icons/pi";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MARKET_WATCH_ICON_IMAGES } from "@/lib/mock-data/market-watch-card";
import { mockPortfolioOpenPositions } from "@/lib/mock-data/portfolio-open-positions";
import { cn } from "@/lib/utils";
import type {
  PortfolioOpenPositionRisk,
  PortfolioOpenPositionRow,
  PortfolioOpenPositionsTableProps,
} from "@/types/portfolio-open-positions";
import type { MarketWatchIcon } from "@/types/market-watch-card";
import type { OpenPositionSide } from "@/types/open-positions-strip";

function formatPrice(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 4 : 2,
  });
}

function formatSize(value: number, unit: string) {
  const decimals = unit === "XRP" ? 4 : 4;
  return `${value.toFixed(decimals)} ${unit}`;
}

function formatSignedCurrency(value: number) {
  if (value === 0) {
    return "-$0.00";
  }

  const prefix = value > 0 ? "+$" : "-$";
  return `${prefix}${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatSignedPercent(value: number) {
  if (value === 0) {
    return "-0.00%";
  }

  const prefix = value > 0 ? "+" : "-";
  return `${prefix}${Math.abs(value).toFixed(2)}%`;
}

function SymbolCell({ icon, symbol }: { icon: MarketWatchIcon; symbol: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src={MARKET_WATCH_ICON_IMAGES[icon]}
        alt={symbol}
        width={24}
        height={24}
        unoptimized
        className="shrink-0 object-contain"
      />
      <span className="font-medium text-white">{symbol}</span>
    </div>
  );
}

function SideBadge({ side }: { side: OpenPositionSide }) {
  const isLong = side === "long";
  const Icon = isLong ? IoIosTrendingUp : IoIosTrendingDown;

  return (
    <span className="inline-flex items-center gap-2.5 border-white/10 bg-white/1 rounded-full border px-1 py-1 text-sm font-normal text-white pr-2.5">
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-full",
          isLong
            ? "bg-linear-to-b from-[#00EB6E] to-[#00853E]"
            : "bg-linear-to-b from-[#EF4444] to-[#980000]",
        )}
      >
        <Icon className="size-3 text-white" />
      </span>
      {isLong ? "Long" : "Short"}
    </span>
  );
}

function RiskBadge({ risk }: { risk: PortfolioOpenPositionRisk }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        risk === "low" && "bg-primary/5 text-primary",
        risk === "medium" && "bg-orange/5 text-orange",
        risk === "high" && "bg-destructive/5 text-destructive",
      )}
    >
      {risk === "low" ? "Low" : risk === "medium" ? "Medium" : "High"}
    </span>
  );
}

function PnlValue({ value, className }: { value: number; className?: string }) {
  const isPositive = value > 0;

  return (
    <span
      className={cn(
        "font-medium",
        isPositive ? "text-primary" : "text-destructive",
        className,
      )}
    >
      {formatSignedCurrency(value)}
    </span>
  );
}

function PnlPercentValue({ value }: { value: number }) {
  const isPositive = value > 0;

  return (
    <span className={cn("font-medium", isPositive ? "text-primary" : "text-destructive")}>
      {formatSignedPercent(value)}
    </span>
  );
}

export function PortfolioOpenPositionsTable({
  positions = mockPortfolioOpenPositions,
  onExport,
  onCloseAll,
  onCancel,
  className,
}: PortfolioOpenPositionsTableProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-6",
        className,
      )}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white md:text-lg">Open Positions</h3>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onExport}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-white/5 bg-white/5 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <PiDownloadFill  className="size-4" />
            Export
          </button>
          <button
            type="button"
            onClick={onCloseAll}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-destructive/10 bg-destructive/10 px-3.5 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
          >
            <IoCloseCircle className="size-4 text-destructive" />
            Close All
          </button>
        </div>
      </div>

      <Table className="min-w-[980px]">
        <TableHeader variant="gradient">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Symbol</TableHead>
            <TableHead className="px-4 h-11 text-sm font-medium text-white/60">Side</TableHead>
            <TableHead className="px-4 h-11 text-sm font-medium text-white/60">Size</TableHead>
            <TableHead className="px-4 h-11 text-sm font-medium text-white/60">Avg Entry</TableHead>
            <TableHead className="px-4 h-11 text-sm font-medium text-white/60">Mark Price</TableHead>
            <TableHead className="px-4 h-11 text-sm font-medium text-white/60">Lev.</TableHead>
            <TableHead className="px-4 h-11 text-sm font-medium text-white/60">P&L</TableHead>
            <TableHead className="px-4 h-11 text-sm font-medium text-white/60">P&L %</TableHead>
            <TableHead className="px-4 h-11 text-sm font-medium text-white/60">Liq</TableHead>
            <TableHead className="px-4 h-11 text-sm font-medium text-white/60">Risk</TableHead>
            <TableHead className="px-4 h-11 text-right text-sm font-medium text-white/60">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="">
          {positions.map((position) => (
            <TableRow
              key={position.id}
              className="border-white/10 b-0! hover:bg-white/5 data-[state=selected]:bg-white/5"
            >
              <TableCell className="px-4 py-1.5">
                <SymbolCell icon={position.icon} symbol={position.symbol} />
              </TableCell>
              <TableCell className="px-4 py-1.5">
                <SideBadge side={position.side} />
              </TableCell>
              <TableCell className="px-4 py-1.5 text-white/60 font-medium">
                {formatSize(position.size, position.sizeUnit)}
              </TableCell>
              <TableCell className="px-4 py-1.5 text-white/60 font-medium">
                {formatPrice(position.avgEntry)}
              </TableCell>
              <TableCell className="px-4 py-1.5 text-white/60 font-medium">
                {formatPrice(position.markPrice)}
              </TableCell>
              <TableCell className="px-4 py-1.5 text-white/60 font-medium">{position.leverage}x</TableCell>
              <TableCell className="px-4 py-1.5 text-white/60 font-medium">
                <PnlValue value={position.pnl} />
              </TableCell>
              <TableCell className="px-4 py-1.5">
                <PnlPercentValue value={position.pnlPercent} />
              </TableCell>
              <TableCell className="px-4 py-1.5 text-white/60 font-medium">
                {formatPrice(position.liquidationPrice)}
              </TableCell>
              <TableCell className="px-4 py-1.5">
                <RiskBadge risk={position.risk} />
              </TableCell>
              <TableCell className="px-4 py-1.5 text-right">
                <button
                  type="button"
                  onClick={() => onCancel?.(position.id)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-destructive/10 bg-destructive/10 px-3.5 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
                >
                  <IoCloseCircle className="size-4 text-destructive" />
                  Cancel
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
