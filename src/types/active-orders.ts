import type { MarketWatchIcon } from "@/types/market-watch-card";

export type ActiveOrderSide = "buy" | "sell";

export type ActiveOrderType = "limit" | "market" | "stop";

export type ActiveOrderStatus = "new" | "partial";

export type ActiveOrderRow = {
  id: string;
  displayId: string;
  symbol: string;
  icon: MarketWatchIcon;
  side: ActiveOrderSide;
  type: ActiveOrderType;
  qty: number;
  price: number;
  takeProfit: number | null;
  stopLoss: number | null;
  status: ActiveOrderStatus;
};

export type ActiveOrdersTableProps = {
  title?: string;
  orders?: ActiveOrderRow[];
  onExport?: () => void;
  onCloseAll?: () => void;
  onCancel?: (orderId: string) => void;
  className?: string;
};
