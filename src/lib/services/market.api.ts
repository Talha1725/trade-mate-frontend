import { MARKET_INTERVAL_TO_V2_INTERVAL_MAP } from "@/constants/v2-market";
import { getV2MarketSnapshot } from "@/lib/services/v2-market-snapshot.api";
import type { ChartCandle } from "@/types/eodhd";
import type { MarketSnapshotResponse } from "@/types/market-snapshot";

function mapCandleTime(openTime: string) {
  const parsed = Date.parse(openTime);

  return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : 0;
}

export const marketApi = {
  async getSnapshot(symbol: string, interval: string = "1d"): Promise<MarketSnapshotResponse> {
    const response = await getV2MarketSnapshot({
      symbol,
      interval: MARKET_INTERVAL_TO_V2_INTERVAL_MAP[interval] ?? "D1",
      limit: 200,
    });

    const latest = response.candles.at(-1);
    const day = response.day;
    const quoteLast = response.quote?.last;

    if (!latest) {
      throw new Error("Market data unavailable.");
    }

    const price = quoteLast ?? latest.close;
    const change = day?.change ?? 0;
    const changePercent = day?.changePercent ?? 0;
    const candles: ChartCandle[] = response.candles.map((candle) => ({
      time: mapCandleTime(candle.openTime),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
    })).filter((candle) => candle.time > 0);

    return {
      symbol: response.symbol,
      interval,
      chart: {
        interval,
        open: day?.open ?? latest.open,
        high: day?.high ?? latest.high,
        low: day?.low ?? latest.low,
        close: price,
        volume: day?.volume ?? latest.volume,
        change,
        changePercent,
        time: latest.openTime,
        source: response.quote ? "eodhd-ws" : "eodhd-db",
      },
      snapshot: {
        price,
        changePercent,
        isLive: Boolean(response.quote),
        badges: [],
        stats: [
          { id: "open", label: "Open", value: String(day?.open ?? latest.open) },
          { id: "high", label: "High", value: String(day?.high ?? latest.high), tone: "success" },
          { id: "low", label: "Low", value: String(day?.low ?? latest.low), tone: "destructive" },
        ],
        sparkline: response.candles.slice(-24).map((candle) => ({ value: candle.close })),
      },
      candles,
    };
  },
};
