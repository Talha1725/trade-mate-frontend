export type OrderBookSortOption = "default" | "price" | "size";

export type OrderBookMidDirection = "up" | "down";

export type OrderBookRow = {
  id: string;
  price: number;
  sizeBtc: number;
  totalBtc: number;
};

export type OrderBookSnapshot = {
  midPrice: number;
  midDirection: OrderBookMidDirection;
  spread: number;
  spreadPercent: number;
  asks: OrderBookRow[];
  bids: OrderBookRow[];
};

export type OrderBookCardProps = {
  title?: string;
  snapshot?: OrderBookSnapshot;
  className?: string;
};
