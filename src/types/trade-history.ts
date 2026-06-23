import type { Trade } from "@/types/trade";

export type TradeHistoryTableProps = {
  trades?: Trade[];
  isLoading?: boolean;
  className?: string;
};
