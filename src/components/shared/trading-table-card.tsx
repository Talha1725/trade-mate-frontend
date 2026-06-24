"use client";

import { IoCloseCircle } from "react-icons/io5";
import { PiDownloadFill } from "react-icons/pi";

import { cn } from "@/lib/utils";
import type { TradingTableCardProps } from "@/types/trading-table-card";

export function TradingTableCard({
  title,
  exportLabel = "Export",
  closeAllLabel = "Close All",
  onExport,
  onCloseAll,
  className,
  children,
}: TradingTableCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-6",
        className,
      )}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white md:text-lg">{title}</h3>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onExport}
            disabled={!onExport}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-white/5 bg-white/5 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PiDownloadFill className="size-4" />
            {exportLabel}
          </button>
          <button
            type="button"
            onClick={onCloseAll}
            disabled={!onCloseAll}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-destructive/10 bg-destructive/10 px-3.5 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IoCloseCircle className="size-4 text-destructive" />
            {closeAllLabel}
          </button>
        </div>
      </div>

      {children}
    </section>
  );
}
