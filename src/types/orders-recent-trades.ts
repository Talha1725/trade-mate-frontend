export type RecentTradeDirection = "up" | "down";

export type RecentTradeRow = {
  id: string;
  price: number;
  direction: RecentTradeDirection;
  sizeBtc: number;
  time: string;
};

export type RecentTradesTableProps = {
  title?: string;
  liveTapeLabel?: string;
  trades?: RecentTradeRow[];
  className?: string;
};
