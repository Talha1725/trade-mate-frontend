"use client";

import Image from "next/image";
import { IoIosTrendingDown } from "react-icons/io";
import { IoIosTrendingUp } from "react-icons/io";
import { MiniAreaLineChart } from "@/components/dashboard/mini-area-line-chart";
import { MARKET_WATCH_ICON_IMAGES } from "@/lib/mock-data/market-watch-card";
import { cn } from "@/lib/utils";
import type {
  OpenPositionStripItem,
  OpenPositionsStripCardProps,
} from "@/types/open-positions-strip";
import Link from "next/link";

function formatPnl(value: number) {
  const prefix = value >= 0 ? "+" : "-";
  return `${prefix}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPercent(value: number) {
  const prefix = value >= 0 ? "+" : "-";
  return `${prefix}${Math.abs(value).toFixed(2)}%`;
}

function SideBadge({ side }: { side: OpenPositionStripItem["side"] }) {
  const isLong = side === "long";
  const Icon = isLong ? IoIosTrendingUp  : IoIosTrendingDown ;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 border-white/10 bg-white/1 rounded-full border px-1 py-1 text-sm font-normal text-white pr-2.5",
         
      )}
    >
      <div className={`${isLong ? "bg-linear-to-b from-[#00EB6E] to-[#00853E]" : "bg-linear-to-b from-[#EF4444] to-[#980000]"} size-6 rounded-full flex items-center justify-center `}>
      <Icon className="size-3 text-white" />
      </div >
        
      {isLong ? "Long" : "Short"}
    </span>
  );
}

function PositionCard({ item }: { item: OpenPositionStripItem }) {
  const isPositive = item.pnl >= 0;

  return (
    <article className="relative overflow-hidden rounded-[20px] border border-white/10 bg-white/5 p-4 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <Image
            src={MARKET_WATCH_ICON_IMAGES[item.icon]}
            alt={item.symbol}
            width={24}
            height={24}
            className="shrink-0 object-contain"
            unoptimized
          />
          <span className="truncate text-base md:text-lg font-semibold text-white">{item.symbol}</span>
        </div>
        <SideBadge side={item.side} />
      </div>

      <div className="mt-2 flex items-end justify-between gap-2">
        <span className={cn("text-base md:text-lg font-medium", isPositive ? "text-primary" : "text-destructive")}>
          {formatPnl(item.pnl)}
        </span>
        <span className={cn("md:text-base text-sm font-normal", isPositive ? "text-primary" : "text-destructive")}>
          {formatPercent(item.pnlPercent)}
        </span>
      </div>

      <p className="mt-1.5 text-sm md:text-base text-white/60">
        {item.sizeLabel} · {item.entryLabel}
      </p>

      <div className="pointer-events-none mt-2 h-16 w-full">
        <MiniAreaLineChart
          values={item.trend.map((point) => point.value)}
          palette={item.palette ?? (isPositive ? "profit" : "loss")}
          showEndDot={false}
          className="h-full w-full"
        />
      </div>
    </article>
  );
}

export function OpenPositionsStripCard({
  title = "Open Positions",
  items,
  className,
}: OpenPositionsStripCardProps) {
  return (
    <section className={cn("rounded-xl border border-white/20 bg-white/5 p-4 md:p-5", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base md:text-lg font-semibold text-white">
          {title} ({items.length})
        </h3>
        <Link href="/porfolio" type="button" className="border border-white/10 rounded-lg bg-white/5 px-3.5 py-2 hover:bg-white/10 transition-colors text-sm font-medium text-white cursor-pointer">
          View All
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <PositionCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
