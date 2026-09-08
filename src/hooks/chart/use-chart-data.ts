import * as React from "react";

import { useChartMarketData } from "@/hooks/use-chart-market-data";
import {
  buildIndicatorSeries,
  buildAlignedCompareSeries,
  calculateEma,
  calculateVwap,
  type VwapCalculationSettings,
} from "@/lib/utils/chart-indicators";
import { mergeLiveQuoteIntoCandles } from "@/lib/utils/merge-live-quote-candles";
import type { ChartCandle, ChartLiveQuote } from "@/types/eodhd";
import type { ChartIndicatorId } from "@/types/lightweight-trading-chart";
import type { TradingTimeframe } from "@/types/trading-filter-bar";

const EMPTY_CANDLES: ChartCandle[] = [];

type UseChartDataOptions = {
  symbol: string;
  compareSymbol: string | null;
  timeframe: TradingTimeframe;
  liveQuote: ChartLiveQuote | null;
  compareLiveQuote: ChartLiveQuote | null;
  initialCandles?: ChartCandle[];
  initialCompareCandles?: ChartCandle[];
  enabledIndicators: ChartIndicatorId[];
  emaPeriod: number;
  vwapSettings: VwapCalculationSettings;
};

export function useChartData({
  symbol,
  compareSymbol,
  timeframe,
  liveQuote,
  compareLiveQuote,
  initialCandles,
  initialCompareCandles,
  enabledIndicators,
  emaPeriod,
  vwapSettings,
}: UseChartDataOptions) {
  const hasInitialCandles = initialCandles !== undefined;
  const hasInitialCompareCandles = initialCompareCandles !== undefined;
  const { data, isLoading, isError } = useChartMarketData(symbol, timeframe, { enabled: !hasInitialCandles });
  const { data: compareData, isLoading: isCompareLoading } = useChartMarketData(compareSymbol ?? "", timeframe, { enabled: !!compareSymbol && !hasInitialCompareCandles });
  const candles = initialCandles ?? data?.candles ?? EMPTY_CANDLES;
  const effectiveLiveQuote = liveQuote;
  const compareCandles = initialCompareCandles ?? compareData?.candles ?? EMPTY_CANDLES;

  const displayCandles = React.useMemo(
    () => effectiveLiveQuote ? mergeLiveQuoteIntoCandles(candles, effectiveLiveQuote, timeframe) : candles,
    [candles, effectiveLiveQuote, timeframe],
  );
  const displayCompareCandles = React.useMemo(
    () => compareLiveQuote && compareSymbol ? mergeLiveQuoteIntoCandles(compareCandles, compareLiveQuote, timeframe) : compareCandles,
    [compareCandles, compareLiveQuote, compareSymbol, timeframe],
  );
  const chartDataKey = React.useMemo(() => [
    symbol,
    timeframe,
    compareSymbol ?? "",
    candles.length,
    candles[candles.length - 1]?.time ?? 0,
    displayCompareCandles.length,
    displayCompareCandles[displayCompareCandles.length - 1]?.time ?? 0,
    compareLiveQuote?.price ?? "",
  ].join("|"), [candles, compareLiveQuote?.price, compareSymbol, displayCompareCandles, symbol, timeframe]);

  const ema = React.useMemo(
    () => enabledIndicators.includes("ema") ? buildIndicatorSeries(displayCandles, calculateEma(displayCandles.map((candle) => candle.close), emaPeriod)) : [],
    [displayCandles, emaPeriod, enabledIndicators],
  );
  const vwap = React.useMemo(
    () => enabledIndicators.includes("vwap") ? calculateVwap(displayCandles, vwapSettings) : [],
    [displayCandles, enabledIndicators, vwapSettings],
  );
  const compareTrack = React.useMemo(
    () => compareSymbol ? buildAlignedCompareSeries(displayCandles, displayCompareCandles) : [],
    [compareSymbol, displayCandles, displayCompareCandles],
  );
  const latestVwapPoint = vwap[vwap.length - 1] ?? null;

  return {
    candles,
    effectiveLiveQuote,
    displayCandles,
    displayCompareCandles,
    compareTrack,
    ema,
    vwap,
    latestVwapPoint,
    chartDataKey,
    isChartLoading: isLoading || (!!compareSymbol && isCompareLoading),
    isError,
    lastDisplayedClose: displayCandles[displayCandles.length - 1]?.close ?? null,
  };
}
