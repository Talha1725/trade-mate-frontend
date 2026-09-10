import { describe, expect, it } from "vitest";

import { applyLiveQuoteToWatchItem } from "@/lib/utils/live-watchlist";
import type { MarketWatchItem } from "@/types/market-watch-card";
import type { PriceSocketQuote } from "@/types/price";

const item: MarketWatchItem = {
  id: "btc",
  symbol: "BTCUSDT",
  name: "BTC / USDT",
  category: "CRYPTO",
  price: 79_234.83,
  open: 79_284.01,
  high: 79_297.6,
  low: 79_218.52,
  volume: 45.476,
  change: -49.18,
  changePercent: -0.06,
};

const quote: PriceSocketQuote = {
  symbol: "BTCUSDT",
  price: 79_310,
  bid: 79_309,
  ask: 79_311,
  volume: 1.25,
  timestamp: "2026-09-09T07:00:00.000Z",
  source: "eodhd-ws",
};

describe("applyLiveQuoteToWatchItem", () => {
  it("keeps watchlist market columns live from the socket tick", () => {
    const result = applyLiveQuoteToWatchItem(item, quote);

    expect(result.price).toBe(79_310);
    expect(result.change).toBeCloseTo(25.99);
    expect(result.changePercent).toBeCloseTo(0.03278);
    expect(result.high).toBe(79_310);
    expect(result.low).toBe(79_218.52);
    expect(result.volume).toBe(46.726);
  });

  it("does not fake change values when today's open is missing", () => {
    const result = applyLiveQuoteToWatchItem(
      { ...item, price: null, open: null, change: null, changePercent: null, high: null, low: null, volume: null },
      quote,
    );

    expect(result.price).toBe(79_310);
    expect(result.change).toBeNull();
    expect(result.changePercent).toBeNull();
    expect(result.high).toBe(79_310);
    expect(result.low).toBe(79_310);
    expect(result.volume).toBe(1.25);
  });

  it("keeps the last known volume when the next socket tick has no volume", () => {
    const previous = applyLiveQuoteToWatchItem(
      { ...item, volume: null },
      quote,
    );

    const result = applyLiveQuoteToWatchItem(previous, {
      ...quote,
      price: 79_320,
      volume: null,
    });

    expect(result.volume).toBe(1.25);
  });
});
