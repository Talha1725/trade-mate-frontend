"use client";

import Image from "next/image";

import { MARKET_WATCH_ICON_IMAGES } from "@/lib/mock-data/market-watch-card";
import {
  formatTradingSymbolLabel,
  resolveMarketWatchIcon,
} from "@/lib/utils/market-symbol-icon";
import { cn } from "@/lib/utils";
import type { TradingSymbolCellProps } from "@/types/trading-symbol-cell";

export function TradingSymbolCell({
  symbol,
  icon,
  className,
}: TradingSymbolCellProps) {
  const resolvedIcon = icon ?? resolveMarketWatchIcon(symbol);
  const label = formatTradingSymbolLabel(symbol);

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/5">
        {resolvedIcon ? (
          <Image
            src={MARKET_WATCH_ICON_IMAGES[resolvedIcon]}
            alt={label}
            width={24}
            height={24}
            unoptimized
            className="size-6 object-contain"
          />
        ) : (
          <span className="size-3 rounded-full bg-white/20" />
        )}
      </span>
      <span className="font-medium text-white">{label}</span>
    </div>
  );
}
