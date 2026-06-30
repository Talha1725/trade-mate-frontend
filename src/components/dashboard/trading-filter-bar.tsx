"use client";

import { CirclePlayIcon, Star } from "lucide-react";

import { CompareAssetsDropdown } from "@/components/dashboard/compare-assets-dropdown";
import { IndicatorsDropdown } from "@/components/dashboard/indicators-dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { AssetIcon } from "@/components/shared/asset-icon";
import { TRADING_TIMEFRAMES } from "@/lib/mock-data/trading-filter-bar";
import { isAssetInWatchlist } from "@/lib/utils/watchlist";
import { cn } from "@/lib/utils";
import type {
  TradingFilterBarAction,
  TradingFilterBarAsset,
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

function AssetOptionLabel({ asset }: { asset: TradingFilterBarAsset }) {
  return (
    <span className="flex items-center gap-2">
      <AssetIcon symbol={asset.symbol} label={asset.label} size={20} />
      <span>{asset.label}</span>
    </span>
  );
}

function AssetDropdownOption({
  asset,
  isInWatchlist,
  onWatchlistToggle,
}: {
  asset: TradingFilterBarAsset;
  isInWatchlist: boolean;
  onWatchlistToggle?: (assetId: string) => void;
}) {
  return (
    <span className="flex w-full min-w-0 items-center gap-2">
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <AssetIcon symbol={asset.symbol} label={asset.label} size={20} />
        <span className="truncate">{asset.label}</span>
      </span>
      <button
        type="button"
        aria-label={isInWatchlist ? `Remove ${asset.label} from watchlist` : `Add ${asset.label} to watchlist`}
        className="pointer-events-auto cursor-pointer shrink-0 rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-primary"
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onWatchlistToggle?.(asset.id);
        }}
      >
        <Star
          className={cn(
            "size-4",
            isInWatchlist ? "fill-primary text-primary" : "text-white/60",
          )}
        />
      </button>
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
  watchlistAssetIds = [],
  onWatchlistToggle,
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
        "grid flex-wrap grid-cols-1 gap-x-10 gap-y-3 xl:grid-cols-2 xl:flex-nowrap min-[1500px]:flex justify-between items-center min-[1500px] gap-3 rounded-xl border border-white/20 bg-white/5 px-3 py-1.5",
        className,
      )}
    >
      <Select
        value={selectedAssetId}
        onValueChange={(value) => {
          if (value) {
            onAssetChange?.(value);
          }
        }}
      >
        <SelectTrigger
          className="h-auto cursor-pointer border-white/20 bg-linear-to-b from-[#6E6E6E1A] to-[#13131505] px-3 py-2 text-left text-sm! text-white shadow-none hover:border-primary hover:bg-white/15 focus-visible:border-primary focus-visible:ring-primary/20 data-placeholder:text-white/60 w-full md:w-auto md:min-w-[240px]!"
        >
          <SelectValue className="font-medium">
            {selectedAsset ? <AssetOptionLabel asset={selectedAsset} /> : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="border-white/20 border rounded-lg bg-[#0d0d0d] text-white max-h-[250px]">
          {assets.map((asset) => (
            <SelectItem
              key={asset.id}
              value={asset.id}
              className="text-white focus:bg-white/10 focus:text-white py-1.5! [&_button]:pointer-events-auto"
            >
              <AssetDropdownOption
                asset={asset}
                isInWatchlist={isAssetInWatchlist(asset.id, watchlistAssetIds)}
                onWatchlistToggle={onWatchlistToggle}
              />
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

      <div className="flex flex-wrap items-center gap-2 ">
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
