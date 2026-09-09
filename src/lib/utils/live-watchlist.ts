import type { MarketWatchItem } from "@/types/market-watch-card";
import type { PriceSocketQuote } from "@/types/price";

function isFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function applyLiveQuoteToWatchItem(
  item: MarketWatchItem,
  liveQuote: PriceSocketQuote | null,
): MarketWatchItem {
  if (!liveQuote) {
    return item;
  }

  const price = liveQuote.price;
  const open = item.open;
  const hasOpen = isFiniteNumber(open) && open > 0;
  const change = hasOpen ? price - open : item.change;
  const changePercent = hasOpen ? ((price - open) / open) * 100 : item.changePercent;
  const high = isFiniteNumber(item.high) ? Math.max(item.high, price) : price;
  const low = isFiniteNumber(item.low) ? Math.min(item.low, price) : price;
  const volume = isFiniteNumber(liveQuote.volume)
    ? (item.volume ?? 0) + liveQuote.volume
    : item.volume;

  return {
    ...item,
    price,
    change,
    changePercent,
    high,
    low,
    volume,
  };
}
