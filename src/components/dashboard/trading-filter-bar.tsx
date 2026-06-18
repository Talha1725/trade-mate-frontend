"use client";

import { CirclePlayIcon } from "lucide-react";

import { CompareAssetsDropdown } from "@/components/dashboard/compare-assets-dropdown";
import { IndicatorsDropdown } from "@/components/dashboard/indicators-dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { TRADING_TIMEFRAMES } from "@/lib/mock-data/trading-filter-bar";
import { cn } from "@/lib/utils";
import type {
  TradingFilterBarAction,
  TradingFilterBarAsset,
  TradingFilterBarAssetIcon,
  TradingFilterBarProps,
} from "@/types/trading-filter-bar";

const FILTER_BAR_ACTIONS = [
  { id: "replay", label: "Replay" },
] as const satisfies ReadonlyArray<TradingFilterBarAction>;

const ACTION_ICON_MAP = {
  replay: CirclePlayIcon,
} as const;

function formatPrice(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatSignedChange(value: number) {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPercent(value: number) {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

function formatVolume(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }

  return value.toLocaleString("en-US");
}

function AssetIcon({ icon }: { icon: TradingFilterBarAssetIcon }) {
  if (icon === "bitcoin") {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-white">
        B
      </span>
    );
  }

  if (icon === "forex") {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue text-[9px] font-bold text-white">
        FX
      </span>
    );
  }

  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted-foreground/30 text-[9px] font-bold text-white">
      ST
    </span>
  );
}

function AssetOptionLabel({ asset }: { asset: TradingFilterBarAsset }) {
  return (
    <span className="flex items-center gap-2">
      <AssetIcon icon={asset.icon} />
      <span>{asset.label}</span>
    </span>
  );
}

function OhlcvStat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <span className="flex items-center gap-1 whitespace-nowrap">
      <span className="text-white/60 text-sm font-medium">{label}</span>
      <span
        className={cn(
          "text-sm font-medium",
          tone === "positive" && "text-primary",
          tone === "negative" && "text-destructive",
          tone === "neutral" && "text-white",
        )}
      >
        {value}
      </span>
    </span>
  );
}

export function TradingFilterBar({
  assets,
  selectedAssetId,
  onAssetChange,
  quote,
  ohlcv,
  timeframe,
  onTimeframeChange,
  compareItems,
  compareAssetId = null,
  onCompareChange,
  onActionClick,
  className,
}: TradingFilterBarProps) {
  const selectedAsset =
    assets.find((asset) => asset.id === selectedAssetId) ?? assets[0];
  const isPositive = quote.change >= 0;

  return (
    <div
      className={cn(
        "flex flex-wrap xl:flex-nowrap justify-between items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-3 py-1.5",
        className,
      )}
    >
      <Select value={selectedAssetId} onValueChange={onAssetChange}>
        <SelectTrigger
          className="h-auto cursor-pointer border-white/20 bg-white/5 px-3 py-[18px] text-left text-sm! text-white shadow-none hover:border-primary hover:bg-white/15 focus-visible:border-primary focus-visible:ring-primary/20 data-placeholder:text-white/60 w-full md:w-auto md:min-w-[240px]!"
        >
          <SelectValue className="font-medium">
            {selectedAsset ? <AssetOptionLabel asset={selectedAsset} /> : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="border-white/15 bg-[#141417] text-white">
          {assets.map((asset) => (
            <SelectItem
              key={asset.id}
              value={asset.id}
              className="text-white focus:bg-white/10 focus:text-white"
            >
              <AssetOptionLabel asset={asset} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <span className="text-base md:text-lg font-medium text-white">
          {formatPrice(quote.price)}
        </span>
        <span
          className={cn(
            "text-xs md:text-sm font-normal",
            isPositive ? "text-primary" : "text-destructive",
          )}
        >
          {formatSignedChange(quote.change)} ({formatPercent(quote.changePercent)})
        </span>
      </div>

      <div className="flex items-center gap-0.5">
        {TRADING_TIMEFRAMES.map((interval) => {
          const isActive = interval === timeframe;

          return (
            <button
              key={interval}
              type="button"
              onClick={() => onTimeframeChange?.(interval)}
              className={cn(
                "px-2.5 py-2 min-w-[40px] text-sm font-medium rounded-lg transition-colors cursor-pointer",
                isActive
                  ? "border border-primary bg-linear-to-r from-dark-blue via-teal-blue to-dark-blue text-primary"
                  : "text-white/60 hover:text-white/80",
              )}
            >
              {interval}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <IndicatorsDropdown />
        <CompareAssetsDropdown
          items={compareItems}
          primaryAssetId={selectedAssetId}
          compareAssetId={compareAssetId}
          onCompareChange={onCompareChange}
        />

        {FILTER_BAR_ACTIONS.map((action) => {
          const Icon = ACTION_ICON_MAP[action.id];

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onActionClick?.(action.id)}
              className="flex items-center gap-1.5 py-2 px-3.5 cursor-pointer rounded-lg text-sm font-medium text-white transition-colors bg-linear-to-r from-white/5 to-white/7 hover:bg-white/10 border border-white/20"
            >
              <Icon className="size-3.5 text-white" />
              {action.label}
            </button>
          );
        })}
      </div>

      <div className=" flex flex-wrap items-center gap-2.5 text-xs">
        <OhlcvStat label="O" value={formatPrice(ohlcv.open)} />
        <OhlcvStat label="H" value={formatPrice(ohlcv.high)} tone="positive" />
        <OhlcvStat label="L" value={formatPrice(ohlcv.low)} tone="negative" />
        <OhlcvStat label="V" value={formatVolume(ohlcv.volume)} />
      </div>
    </div>
  );
}
