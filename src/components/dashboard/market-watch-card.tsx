"use client";

import Image from "next/image";
import { useState } from "react";

import {
  MARKET_WATCH_ICON_IMAGES,
  mockMarketNews,
  mockMarketSignals,
  MARKET_WATCH_TABS,
} from "@/lib/mock-data/market-watch-card";
import { cn } from "@/lib/utils";
import type {
  MarketWatchCardProps,
  MarketNewsItem,
  MarketSignalItem,
  MarketWatchIcon,
  MarketWatchItem,
  MarketWatchTab,
} from "@/types/market-watch-card";

function formatPrice(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercent(value: number) {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

function WatchlistIcon({ icon, name }: { icon: MarketWatchIcon; name: string }) {
  return (
    <span className="relative flex shrink-0 items-center justify-center overflow-hidden">
      <Image
        src={MARKET_WATCH_ICON_IMAGES[icon]}
        alt={name}
        width={32}
        height={32}
        unoptimized
        className=" object-contain"
      />
    </span>
  );
}

function WatchlistRow({
  item,
  isSelected,
  onSelect,
}: {
  item: MarketWatchItem;
  isSelected: boolean;
  onSelect?: () => void;
}) {
  const isPositive = item.changePercent >= 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center cursor-pointer justify-between gap-2.5 rounded-[10px] px-3.5 py-1.5 text-left transition-colors",
        isSelected ? "btn-green" : "hover:bg-white/5",
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <WatchlistIcon icon={item.icon} name={item.name} />
        <span className="min-w-0">
          <span className="block truncate tracking-tight text-sm md:text-base font-medium text-white">{item.symbol}</span>
          <span className="block truncate text-xs md:text-sm text-white/60">{item.name}</span>
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span className="block tracking-tight text-sm md:text-base font-medium text-white">{formatPrice(item.price)}</span>
        <span
          className={cn(
            "block text-xs md:text-sm font-medium",
            isPositive ? "text-primary" : "text-destructive",
          )}
        >
          {formatPercent(item.changePercent)}
        </span>
      </span>
    </button>
  );
}



function SignalsList({ signals }: { signals: MarketSignalItem[] }) {
  return (
    <div className="space-y-3 pt-1">
      {signals.map((signal) => (
        <div key={signal.id} className="flex items-center justify-between gap-3 text-sm">
          <span className="text-white/60">{signal.label}</span>
          <span
            className={cn(
              "font-semibold",
              signal.tone === "positive" && "text-primary",
              signal.tone === "warning" && "text-orange",
              signal.tone === "neutral" && "text-white",
            )}
          >
            {signal.signal}
          </span>
        </div>
      ))}
    </div>
  );
}

function NewsList({ news }: { news: MarketNewsItem[] }) {
  return (
    <div className="space-y-3 pt-1">
      {news.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
          <span className="text-white font-medium">{item.headline}</span>
          <span className="shrink-0 text-white/60">{item.minutesAgo}m</span>
        </div>
      ))}
    </div>
  );
}

export function MarketWatchCard({
  items,
  signals = mockMarketSignals,
  news = mockMarketNews,
  selectedItemId,
  onItemSelect,
  className,
}: MarketWatchCardProps) {
  const [activeTab, setActiveTab] = useState<MarketWatchTab>("watchlist");

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-white/20 bg-white/5 p-4 md:p-6",
        className,
      )}
    >
      <div className="flex gap-6 ">
        {MARKET_WATCH_TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "cursor-pointer px-2 pb-1 text-base font-medium transition-colors md:text-lg",
                isActive
                  ? "border-b-2 border-primary text-primary"
                  : "text-white/60 hover:text-white/80",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex-1">
        {activeTab === "watchlist" ? (
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <WatchlistRow
                key={item.id}
                item={item}
                isSelected={item.id === selectedItemId}
                onSelect={() => onItemSelect?.(item.id)}
              />
            ))}
          </div>
        ) : null}

        {/* {activeTab === "signals" ? (
          <SignalsList signals={signals} />
        ) : null}

        {activeTab === "news" ? (
          <NewsList news={news} />
        ) : null} */}
      </div>
    </div>
  );
}
