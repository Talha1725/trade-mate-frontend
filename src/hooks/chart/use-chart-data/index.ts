import * as React from "react";

import { useChartMarketData } from "@/hooks/use-chart-market-data";
import { chartMarketApi } from "@/lib/services/chart-market.api";
import {
  buildIndicatorSeries,
  buildAlignedCompareSeries,
  calculateEma,
  calculateVwap,
} from "@/lib/utils/chart-indicators";
import { mergeLiveQuoteIntoCandles } from "@/lib/utils/merge-live-quote-candles";
import type { ChartCandle } from "@/types/eodhd";
import type { UseChartDataOptions } from "@/types/chart/chart-component-props";

const EMPTY_CANDLES: ChartCandle[] = [];
const MIN_OLDER_CANDLE_LOADER_MS = 500;

function mergeCandles(...candleGroups: Array<ChartCandle[] | undefined>) {
  const candlesByTime = new Map<number, ChartCandle>();

  for (const candles of candleGroups) {
    for (const candle of candles ?? []) {
      candlesByTime.set(candle.time, candle);
    }
  }

  return [...candlesByTime.values()].sort((left, right) => left.time - right.time);
}

export function useChartData({
  symbol,
  compareSymbol,
  timeframe,
  liveQuote,
  compareLiveQuote,
  initialCandles,
  initialCompareCandles,
  initialCandlesKey,
  enabledIndicators,
  emaPeriod,
  vwapSettings,
}: UseChartDataOptions) {
  const { data, isLoading, isError } = useChartMarketData(symbol, timeframe);
  const { data: compareData, isLoading: isCompareLoading } = useChartMarketData(compareSymbol ?? "", timeframe, { enabled: !!compareSymbol });
  const [olderCandles, setOlderCandles] = React.useState<ChartCandle[]>(EMPTY_CANDLES);
  const [olderCompareCandles, setOlderCompareCandles] = React.useState<ChartCandle[]>(EMPTY_CANDLES);
  const [hasOlderCandles, setHasOlderCandles] = React.useState(true);
  const [isLoadingOlderCandles, setIsLoadingOlderCandles] = React.useState(false);
  const olderLoadKeyRef = React.useRef<string | null>(null);
  const chartSelectionKey = React.useMemo(
    () => [symbol, timeframe, compareSymbol ?? ""].join("|"),
    [compareSymbol, symbol, timeframe],
  );
  const validInitialCandles = initialCandlesKey === chartSelectionKey ? initialCandles : undefined;
  const validInitialCompareCandles = initialCandlesKey === chartSelectionKey ? initialCompareCandles : undefined;
  const candles = React.useMemo(
    () => mergeCandles(olderCandles, validInitialCandles, data?.candles),
    [data?.candles, olderCandles, validInitialCandles],
  );
  const effectiveLiveQuote = liveQuote;
  const compareCandles = React.useMemo(
    () => mergeCandles(olderCompareCandles, validInitialCompareCandles, compareData?.candles),
    [compareData?.candles, olderCompareCandles, validInitialCompareCandles],
  );

  React.useEffect(() => {
    setOlderCandles(EMPTY_CANDLES);
    setOlderCompareCandles(EMPTY_CANDLES);
    setHasOlderCandles(true);
    setIsLoadingOlderCandles(false);
    olderLoadKeyRef.current = null;
  }, [symbol, compareSymbol, timeframe]);

  const loadOlderCandles = React.useCallback(async () => {
    const oldestTime = candles[0]?.time;

    if (!oldestTime || isLoadingOlderCandles || !hasOlderCandles) {
      return 0;
    }

    const loadKey = `${symbol}|${compareSymbol ?? ""}|${timeframe}|${oldestTime}`;
    if (olderLoadKeyRef.current === loadKey) {
      return 0;
    }

    olderLoadKeyRef.current = loadKey;
    setIsLoadingOlderCandles(true);

    try {
      const [nextCandles, nextCompareCandles] = await Promise.all([
        chartMarketApi.getOlderCandles(symbol, timeframe, oldestTime),
        compareSymbol ? chartMarketApi.getOlderCandles(compareSymbol, timeframe, oldestTime).catch(() => EMPTY_CANDLES) : Promise.resolve(EMPTY_CANDLES),
      ]);
      const existingTimes = new Set(candles.map((candle) => candle.time));
      const additions = nextCandles.filter((candle) => candle.time < oldestTime && !existingTimes.has(candle.time));

      if (additions.length === 0) {
        setHasOlderCandles(false);
        return 0;
      }

      setOlderCandles((current) => mergeCandles(additions, current));

      if (compareSymbol) {
        setOlderCompareCandles((current) => mergeCandles(
          nextCompareCandles.filter((candle) => candle.time < oldestTime),
          current,
        ));
      }

      return additions.length;
    } finally {
      window.setTimeout(() => {
        setIsLoadingOlderCandles(false);
        olderLoadKeyRef.current = null;
      }, MIN_OLDER_CANDLE_LOADER_MS);
    }
  }, [candles, compareSymbol, hasOlderCandles, isLoadingOlderCandles, symbol, timeframe]);

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
  const chartViewportKey = React.useMemo(() => {
    const hasCurrentQueryData = data?.symbol === symbol && data.timeframe === timeframe && data.candles.length > 0;
    const hasCurrentInitialData = initialCandlesKey === chartSelectionKey && (initialCandles?.length ?? 0) > 0;

    if (!hasCurrentQueryData && !hasCurrentInitialData) {
      return null;
    }

    return chartSelectionKey;
  }, [chartSelectionKey, data, initialCandles?.length, initialCandlesKey, symbol, timeframe]);

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
    chartViewportKey,
    isChartLoading: candles.length === 0 && (isLoading || (!!compareSymbol && isCompareLoading)),
    isLoadingOlderCandles,
    loadOlderCandles,
    isError,
    lastDisplayedClose: displayCandles[displayCandles.length - 1]?.close ?? null,
  };
}
