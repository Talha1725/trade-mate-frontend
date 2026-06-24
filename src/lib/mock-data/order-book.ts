import type { OrderBookSnapshot } from "@/types/order-book";

export const mockOrderBookSnapshot: OrderBookSnapshot = {
  midPrice: 69_102.75,
  midDirection: "up",
  spread: 0.25,
  spreadPercent: 0.0004,
  asks: [
    { id: "ask-1", price: 69_104, sizeBtc: 0.2847, totalBtc: 0.2847 },
    { id: "ask-2", price: 69_103.5, sizeBtc: 0.3521, totalBtc: 0.6368 },
    { id: "ask-3", price: 69_103, sizeBtc: 0.1923, totalBtc: 0.8291 },
    { id: "ask-4", price: 69_102.5, sizeBtc: 0.4156, totalBtc: 1.2447 },
    { id: "ask-5", price: 69_102, sizeBtc: 0.1734, totalBtc: 1.4181 },
    { id: "ask-6", price: 69_101.5, sizeBtc: 0.3289, totalBtc: 1.747 },
  ],
  bids: [
    { id: "bid-1", price: 69_101, sizeBtc: 0.2654, totalBtc: 0.2654 },
    { id: "bid-2", price: 69_100.5, sizeBtc: 0.1847, totalBtc: 0.4501 },
    { id: "bid-3", price: 69_100, sizeBtc: 0.3921, totalBtc: 0.8422 },
    { id: "bid-4", price: 69_099.5, sizeBtc: 0.1568, totalBtc: 0.999 },
    { id: "bid-5", price: 69_099, sizeBtc: 0.2873, totalBtc: 1.2863 },
    { id: "bid-6", price: 69_098.5, sizeBtc: 0.4235, totalBtc: 1.7098 },
  ],
};
