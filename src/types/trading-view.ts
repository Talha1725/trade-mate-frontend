import type { PositionSummary } from "@/types/dashboard";
import type { RecentActivityItem } from "@/types/dashboard";

export type TradingChartProps = {
  symbol?: string;
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
};

export type LiveTradingViewProps = {
  symbol?: string;
  positions?: PositionSummary[];
  recentActivity?: RecentActivityItem[];
};

export type TradingViewWidget = {
  widget: new (config: {
    autosize: boolean;
    symbol: string;
    interval: string;
    timezone: string;
    theme: "light" | "dark";
    style: string;
    locale: string;
    toolbar_bg?: string;
    enable_publishing?: boolean;
    allow_symbol_change?: boolean;
    hide_side_toolbar?: boolean;
    hide_top_toolbar?: boolean;
    save_image?: boolean;
    container_id: string;
  }) => unknown;
};

export type TradingViewWindow = Window & {
  TradingView?: TradingViewWidget;
};
