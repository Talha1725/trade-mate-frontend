import { getV2MarketCandles, getV2MarketSnapshot } from "@/lib/services/v2-market-snapshot.api";
import { V2_TIMEFRAME_INTERVAL_MAP } from "@/constants/v2-market";
import type { MarketQuoteResponse } from "@/types/market";
import type { ChartMarketDataResponse, EodhdAssetQuote, EodhdQuotesResponse } from "@/types/eodhd";
import type { TradingTimeframe } from "@/types/trading-filter-bar";

function mapQuote(quote: MarketQuoteResponse["quotes"][number]): EodhdAssetQuote {
  return {
    symbol: quote.symbol,
    eodhdSymbol: quote.symbol,
    price: quote.price,
    change: quote.change ?? 0,
    changePercent: quote.changePercent ?? 0,
    open: quote.price,
    high: quote.price,
    low: quote.price,
    volume: 0,
    timestamp: quote.timestamp,
    dataSource: quote.source === "eodhd-ws" ? "realtime" : "eod",
  };
}

export const chartMarketApi = {
  async getQuotes(symbols: string[]) {
    const quotes = await Promise.all(
      symbols.map(async (symbol) => {
        const candles = await getV2MarketCandles({
          symbol,
          interval: "M1",
          limit: 2,
        });
        const latest = candles.at(-1);
        const previous = candles.at(-2);

        if (!latest) {
          return null;
        }

        const change = previous ? latest.close - previous.close : 0;
        const changePercent = previous?.close ? (change / previous.close) * 100 : 0;

        const quote: MarketQuoteResponse["quotes"][number] = {
          symbol,
          price: latest.close,
          bid: latest.close,
          ask: latest.close,
          change,
          changePercent,
          timestamp: latest.openTime,
          source: latest.live ? "eodhd-ws" : "eodhd-db",
        };

        return quote;
      }),
    );

    return {
      quotes: Object.fromEntries(
        quotes
          .filter((quote): quote is MarketQuoteResponse["quotes"][number] => quote !== null)
          .map((quote) => [quote.symbol.toUpperCase(), mapQuote(quote)]),
      ),
    } satisfies EodhdQuotesResponse;
  },

  async getCandles(symbol: string, timeframe: TradingTimeframe) {
    const response = await getV2MarketSnapshot({
      symbol,
      interval: V2_TIMEFRAME_INTERVAL_MAP[timeframe],
    });

    return {
      symbol: response.symbol,
      eodhdSymbol: response.symbol,
      timeframe,
      candles: response.candles.map((candle) => ({
        time: Math.floor(new Date(candle.openTime).getTime() / 1000),
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
      })),
      dataSource: timeframe === "D" || timeframe === "W" ? "eod" : "intraday",
    } satisfies ChartMarketDataResponse;
  },
};
