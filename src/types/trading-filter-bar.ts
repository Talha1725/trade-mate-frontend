import type { CompareAssetItem } from "@/types/trading-compare-assets";

export type TradingTimeframe = "1m" | "5m" | "15m" | "1H" | "4H" | "D" | "W";

export type TradingFilterBarActionId = "indicators" | "compare" | "replay";

export type TradingFilterBarAssetIcon = "bitcoin" | "forex" | "stock";

export type TradingFilterBarAsset = {
  id: string;
  label: string;
  symbol: string;
  icon: TradingFilterBarAssetIcon;
};

export type TradingFilterBarQuote = {
  price: number;
  change: number;
  changePercent: number;
};

export type TradingFilterBarOhlcv = {
  open: number;
  high: number;
  low: number;
  volume: number;
};

export type TradingFilterBarAction = {
  id: TradingFilterBarActionId;
  label: string;
};

export type TradingFilterBarProps = {
  assets: TradingFilterBarAsset[];
  selectedAssetId: string;
  onAssetChange?: (assetId: string) => void;
  quote: TradingFilterBarQuote;
  ohlcv: TradingFilterBarOhlcv;
  timeframe: TradingTimeframe;
  onTimeframeChange?: (timeframe: TradingTimeframe) => void;
  compareItems: CompareAssetItem[];
  compareAssetId?: string | null;
  onCompareChange?: (assetId: string | null) => void;
  onActionClick?: (action: TradingFilterBarActionId) => void;
  className?: string;
};

export type TradingFilterBarState = {
  selectedAssetId: string;
  timeframe: TradingTimeframe;
};
