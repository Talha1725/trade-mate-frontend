import type { ReactNode } from "react";

export type TradingTableCardProps = {
  title: string;
  exportLabel?: string;
  closeAllLabel?: string;
  onExport?: () => void;
  onCloseAll?: () => void;
  className?: string;
  children: ReactNode;
};
