import type { MarketWatchIcon } from "@/types/market-watch-card";
import type {
  EquityCurveDatum,
  PositionSummary,
  RecentActivityItem,
  StatCardDatum,
  SymbolBreakdownDatum,
} from "@/types/dashboard";

export type MiniAreaLineChartPalette = "profit" | "loss";

export type MiniAreaLineChartProps = {
  values: number[];
  className?: string;
  strokeId?: string;
  fromZero?: boolean;
  minValue?: number;
  maxValue?: number;
  palette?: MiniAreaLineChartPalette;
  showEndDot?: boolean;
};

export type SparklineDatum = {
  value: number;
};

export type SparklineChartProps = {
  data: SparklineDatum[];
  className?: string;
  showEndDot?: boolean;
  palette?: MiniAreaLineChartPalette;
  fromZero?: boolean;
  minValue?: number;
  maxValue?: number;
};

export type OpenPositionSide = "long" | "short";

export type OpenPositionStripItem = {
  id: string;
  symbol: string;
  icon: MarketWatchIcon;
  side: OpenPositionSide;
  pnl: number;
  pnlPercent: number;
  sizeLabel: string;
  entryLabel: string;
  trend: SparklineDatum[];
  palette?: MiniAreaLineChartPalette;
  entryPrice?: number;
  markPrice?: number | null;
  stopLoss?: number | null;
  takeProfit?: number | null;
  lots?: number;
};

export type OpenPositionsStripCardProps = {
  title?: string;
  items: OpenPositionStripItem[];
  className?: string;
  onClosePosition?: (positionId: string, lots?: number) => Promise<void>;
  onModifyProtection?: (input: { positionId: string; stopLoss: number | null; takeProfit: number | null }) => Promise<{ status: "PENDING" | "SENT" | "FAILED" | "SKIPPED" }>;
};

export type PositionCardProps = {
  item: OpenPositionStripItem;
  onClosePosition?: (positionId: string, lots?: number) => Promise<void>;
  onModifyProtection?: OpenPositionsStripCardProps["onModifyProtection"];
};

export type CompareAssetItem = {
  id: string;
  symbol: string;
  name: string;
};

export type CompareAssetsDropdownProps = {
  primaryAssetId: string;
  assets: import("@/types/trading-filter-bar").TradingFilterBarAsset[];
  compareAssetId?: string | null;
  onCompareChange?: (assetId: string | null) => void;
  className?: string;
};

export type TradingIndicatorItem = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export type IndicatorsDropdownProps = {
  indicators?: TradingIndicatorItem[];
  resetTemplateLabel?: string;
  onIndicatorChange?: (id: string, enabled: boolean) => void;
  onResetTemplate?: () => void;
  className?: string;
};

export type StatCardsProps = {
  stats?: StatCardDatum[];
};

export type EquityChartProps = {
  data?: EquityCurveDatum[];
};

export type BreakdownWidgetsProps = {
  data?: SymbolBreakdownDatum[];
};

export type OpenPositionsSummaryProps = {
  positions?: PositionSummary[];
};

export type RecentActivityProps = {
  items?: RecentActivityItem[];
};
