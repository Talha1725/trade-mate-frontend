import type { ReactNode } from "react";

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
