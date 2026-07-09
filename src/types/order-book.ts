export type OrderBookSortOption = "default" | "price" | "size";

export type OrderBookMidDirection = "up" | "down";

export type OrderBookRow = {
  id: string;
  price: number;
  size: number;
  total: number;
  barPercent: number;
};

export type OrderBookSnapshot = {
  midPrice: number;
  bestBid: number;
  bestAsk: number;
  midDirection: OrderBookMidDirection;
  spread: number;
  spreadPercent: number;
  asks: OrderBookRow[];
  bids: OrderBookRow[];
  isSimulated: true;
  source: "EODHD";
};

export type OrderBookCardProps = {
  title?: string;
  assetLabel?: string | null;
  snapshot?: OrderBookSnapshot | null;
  sizeLabel?: string;
  assetClass?: string | null;
  symbol?: string | null;
  className?: string;
};
