"use client";

import { cn } from "@/lib/utils";

export const TRADING_TABLE_ROW_CLASS =
  "border-white/10 hover:bg-white/5 data-[state=selected]:bg-white/5";

export function formatTradingPrice(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 4 : 2,
  });
}

export function formatTradingQty(value: number) {
  if (Number.isInteger(value) || value >= 100) {
    return value.toLocaleString("en-US");
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

export function formatSignedCurrency(value: number) {
  if (value === 0) {
    return "$0.00";
  }

  const prefix = value > 0 ? "+$" : "-$";
  return `${prefix}${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

type TradingSide = "Buy" | "Sell" | "buy" | "sell";

export function TradingSideBadge({ side }: { side: TradingSide }) {
  const isBuy = side === "Buy" || side === "buy";
  const label = isBuy ? "Buy" : "Sell";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium border",
        isBuy ? "bg-primary/5 text-primary border-primary/3" : "bg-destructive/5 text-destructive border-destructive/3",
      )}
    >
      {label}
    </span>
  );
}

export function TradingOrderStatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "primary" | "orange";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium border",
        tone === "primary" && "bg-primary/5 border-primary/3 text-primary",
        tone === "orange" && "bg-orange/5 border-orange/3 text-orange",
      )}
    >
      {label}
    </span>
  );
}

export function TradingPnlValue({ value }: { value: number }) {
  const isPositive = value > 0;

  return (
    <span
      className={cn(
        "font-medium",
        isPositive ? "text-primary" : value < 0 ? "text-destructive" : "text-white/60",
      )}
    >
      {formatSignedCurrency(value)}
    </span>
  );
}
