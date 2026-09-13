import type { ReactNode } from "react";

export type ResponsiveTableScrollProps = {
  children: ReactNode;
  className?: string;
};

export type TradingSymbolCellProps = {
  symbol: string;
  className?: string;
};

export type TradingTableCardProps = {
  title: string;
  exportLabel?: string;
  closeAllLabel?: string;
  onExport?: () => void;
  onCloseAll?: () => void;
  isCloseAllLoading?: boolean;
  className?: string;
  children: ReactNode;
};
