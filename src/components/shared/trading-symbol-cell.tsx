"use client";

import { AssetIcon } from "@/components/shared/asset-icon";
import { formatTradingSymbolLabel } from "@/lib/utils/market-symbol-icon";
import { cn } from "@/lib/utils";
import type { TradingSymbolCellProps } from "@/types/trading-symbol-cell";

export function TradingSymbolCell({ symbol, className }: TradingSymbolCellProps) {
  const label = formatTradingSymbolLabel(symbol);

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <AssetIcon symbol={symbol} label={label} size={24} />
      <span className="font-medium text-white">{label}</span>
    </div>
  );
}
