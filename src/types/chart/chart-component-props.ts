import type * as React from "react";
import type { IChartApi, ISeriesApi } from "lightweight-charts";

import type { ChartCandle, ChartLiveQuote } from "@/types/eodhd";
import type { VwapCalculationSettings, VwapPoint } from "@/types/chart/chart-indicators";
import type { ChartIndicatorId, ChartToolId, MagnetMode } from "@/types/lightweight-trading-chart";
import type { TradingTimeframe } from "@/types/trading-filter-bar";

export type DrawingRendererContext = {
  activeTool: string;
  displayCandles: Array<{ time: number; volume?: number }>;
  getChartPoint: (event: React.PointerEvent<HTMLElement>) => { time: number; price: number; logicalIndex?: number } | null;
  selectedDrawingId: string | null;
  toPixelPoint: (point: { time: number; price: number }) => { x: number; y: number } | null;
  drawingOverlayRef: React.RefObject<SVGSVGElement | null>;
  mainChartRef: React.MutableRefObject<{ timeScale: () => { width: () => number } } | null>;
  candleSeriesRef: React.MutableRefObject<{ priceToCoordinate: (price: number) => number | null } | null>;
  draggingTextRef: React.MutableRefObject<{ id: string; start: unknown; originalPoint: unknown } | null>;
  setSelectedDrawingId: (id: string | null) => void;
  setTextEditor: (value: { point: { time: number; price: number }; value: string; pixel: { x: number; y: number }; editingId?: string } | null) => void;
};

export type ChartIndicatorPanelProps = {
  enabledIndicators: ChartIndicatorId[];
  indicatorPeriods: { ema: number };
  setIndicatorPeriods: React.Dispatch<React.SetStateAction<{ ema: number }>>;
  vwapSettings: VwapCalculationSettings;
  setVwapSettings: React.Dispatch<React.SetStateAction<VwapCalculationSettings>>;
  latestVwapPoint: VwapPoint | null;
  symbol: string;
  isVwapSettingsOpen: boolean;
  setIsVwapSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  vwapSettingsTab: "inputs" | "style" | "visibility";
  setVwapSettingsTab: React.Dispatch<React.SetStateAction<"inputs" | "style" | "visibility">>;
};

export type ChartToolbarPanelProps = {
  activeTool: ChartToolId;
  magnetMode: MagnetMode;
  enabledIndicators: ChartIndicatorId[];
  onToolChange: (tool: ChartToolId) => void;
  onMagnetToggle: () => void;
  onIndicatorToggle: (indicator: ChartIndicatorId) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
};

export type ChartToolbarProps = {
  className?: string;
  activeTool: ChartToolId;
  magnetMode: MagnetMode;
  onToolChange: (tool: ChartToolId) => void;
  onMagnetToggle: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  enabledIndicators: ChartIndicatorId[];
  onIndicatorToggle: (indicator: ChartIndicatorId) => void;
};

export type UseChartDataOptions = {
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

export type ChartInstanceOptions = {
  mainContainerRef: React.RefObject<HTMLDivElement | null>;
  subContainerRef: React.RefObject<HTMLDivElement | null>;
  mainChartRef: React.MutableRefObject<IChartApi | null>;
  subChartRef: React.MutableRefObject<IChartApi | null>;
  mainSeriesRef: React.MutableRefObject<ISeriesApi<"Candlestick" | "Line" | "Area">[]>;
  subSeriesRef: React.MutableRefObject<ISeriesApi<"Area">[]>;
  candleSeriesRef: React.MutableRefObject<ISeriesApi<"Candlestick"> | null>;
  emaSeriesRef: React.MutableRefObject<ISeriesApi<"Line"> | null>;
  vwapSeriesRef: React.MutableRefObject<ISeriesApi<"Line"> | null>;
  vwapUpperSeriesRefs: React.MutableRefObject<Array<ISeriesApi<"Line"> | null>>;
  vwapLowerSeriesRefs: React.MutableRefObject<Array<ISeriesApi<"Line"> | null>>;
  priceLineRef: React.MutableRefObject<ReturnType<ISeriesApi<"Candlestick">["createPriceLine"]> | null>;
  priceLabelRef: React.RefObject<HTMLDivElement | null>;
  lastCloseRef: React.MutableRefObject<number | null>;
  initialViewKeyRef: React.MutableRefObject<string | null>;
  symbol: string;
  timeframe: TradingTimeframe;
  normalizedCompareSymbol: string | null;
  displayCandles: ChartCandle[];
  displayCompareCandles: ChartCandle[];
  compareTrack: Array<{ time: number; value: number }>;
  enabledIndicators: string[];
  vwap: VwapPoint[];
  vwapSettings: VwapCalculationSettings;
  ema: Array<{ time: number; value: number }>;
  effectiveLiveQuote: ChartLiveQuote | null;
  candles: ChartCandle[];
  chartDataKey: string;
  overlayRevision: React.Dispatch<React.SetStateAction<number>>;
  indicatorPeriods: { ema: number };
  syncLastPriceLabel: (series: ISeriesApi<"Candlestick">, price: number, label: HTMLDivElement | null, symbol: string) => void;
  onOhlcvChange?: (candle: ChartCandle | null) => void;
  onLoadMoreCandles?: () => Promise<number>;
  isLoadingOlderCandles?: boolean;
};
