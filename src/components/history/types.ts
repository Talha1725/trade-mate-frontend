import type { Trade } from "@/types/trade";

export type TradeHistoryPagination = {
  page: number;
  pageCount: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

export type TradeHistoryTableProps = {
  trades?: Trade[];
  isLoading?: boolean;
  className?: string;
  pagination?: TradeHistoryPagination;
};
