import * as React from "react";
import type { Column, ColumnDef } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import type { NavItem, LoginFormValues } from "@/types";
import type {
  EquityCurveDatum,
  PositionSummary,
  RecentActivityItem,
  StatCardDatum,
  SymbolBreakdownDatum,
} from "@/types/dashboard";
import type { Position, Trade, TradeOrderDirection } from "@/types/trade";
import type {
  TradingFilterBarAsset,
  TradingFilterBarOhlcv,
  TradingFilterBarQuote,
  TradingTimeframe,
} from "@/types/trading-filter-bar";

export type AppShellProps = {
  userLabel?: string;
  onSignOut?: () => void;
  children: React.ReactNode;
  className?: string;
};

export type BrandMarkProps = {
  className?: string;
  showName?: boolean;
};

export type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
};

export type SectionCardProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

export type SidebarNavProps = {
  items: NavItem[];
  iconFor?: (item: NavItem) => LucideIcon | undefined;
  className?: string;
};

export type AppShellSidebarNavProps = {
  items: NavItem[];
  collapsed: boolean;
  userLabel?: string;
  onSignOut?: () => void;
};

export type TopBarProps = {
  userLabel?: string;
  onSignOut?: () => void;
};

export type ProfileMenuProps = {
  userLabel?: string;
  onSignOut?: () => void;
};

export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  // Server-side pagination
  serverPagination?: {
    page: number;
    pageCount: number;
    totalItems?: number;
    pageSize?: number;
    pageSizeOptions?: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };
};

export type SortableColumnHeaderProps<TData, TValue = unknown> = {
  column: Column<TData, TValue>;
  label: string;
  className?: string;
};

export type LoginFormProps = {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
  redirectTo?: string;
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

export type SymbolSearchProps = {
  symbol?: string;
  price?: number;
  symbols?: string[];
  onSymbolChange?: (symbol: string) => void;
};

export type OrderTicketSubmitPayload = {
  accountId: string;
  symbol: string;
  direction: TradeOrderDirection;
  lots: number;
  stopLoss?: number | null;
  takeProfit?: number | null;
};

export type OrderTicketProps = {
  accountId?: string;
  symbol?: string;
  price?: number;
  onSubmit?: (payload: OrderTicketSubmitPayload) => Promise<void> | void;
  isSubmitting?: boolean;
};

export type OpenPositionsTableProps = {
  positions?: Position[];
  onClosePosition?: (position: Position) => Promise<void> | void;
};

export type TradeHistoryTableProps = {
  trades?: Trade[];
  isLoading?: boolean;
};
