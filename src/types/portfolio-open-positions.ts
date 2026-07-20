import type { MarketWatchIcon } from "@/types/market-watch-card";
import type { OpenPositionSide } from "@/types/open-positions-strip";

export type PortfolioOpenPositionRisk = "low" | "medium" | "high";

export type PortfolioOpenPositionRow = {
  id: string;
  symbol: string;
  icon: MarketWatchIcon;
  side: OpenPositionSide;
  size: number;
  sizeUnit: string;
  avgEntry: number;
  markPrice: number;
  leverage: number;
  pnl: number;
  pnlPercent: number;
  liquidationPrice: number;
  risk: PortfolioOpenPositionRisk;
};

export type PortfolioOpenPositionsTableProps = {
  positions?: PortfolioOpenPositionRow[];
  onExport?: () => void;
  onCloseAll?: () => void;
  isCloseAllLoading?: boolean;
  onCancel?: (positionId: string) => void | Promise<void>;
  className?: string;
};
