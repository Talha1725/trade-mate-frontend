import type { OrderBookSnapshot } from "@/types/order-book";

export const mockOrderBookSnapshot: OrderBookSnapshot = {
  midPrice: 69_102.75,
  bestBid: 69_102.5,
  bestAsk: 69_103,
  midDirection: "up",
  spread: 0.25,
  spreadPercent: 0.0004,
  asks: [
    { id: "ask-1", price: 69_103, size: 0.2847, total: 0.2847, barPercent: 16.3 },
    { id: "ask-2", price: 69_103.5, size: 0.3521, total: 0.6368, barPercent: 36.45 },
    { id: "ask-3", price: 69_104, size: 0.1923, total: 0.8291, barPercent: 47.49 },
    { id: "ask-4", price: 69_104.5, size: 0.4156, total: 1.2447, barPercent: 71.27 },
    { id: "ask-5", price: 69_105, size: 0.1734, total: 1.4181, barPercent: 81.19 },
    { id: "ask-6", price: 69_105.5, size: 0.3289, total: 1.747, barPercent: 100 },
  ],
  bids: [
    { id: "bid-1", price: 69_102.5, size: 0.2654, total: 0.2654, barPercent: 15.52 },
    { id: "bid-2", price: 69_102, size: 0.1847, total: 0.4501, barPercent: 26.34 },
    { id: "bid-3", price: 69_101.5, size: 0.3921, total: 0.8422, barPercent: 49.29 },
    { id: "bid-4", price: 69_101, size: 0.1568, total: 0.999, barPercent: 58.46 },
    { id: "bid-5", price: 69_100.5, size: 0.2873, total: 1.2863, barPercent: 75.25 },
    { id: "bid-6", price: 69_100, size: 0.4235, total: 1.7098, barPercent: 100 },
  ],
  isSimulated: true,
  source: "EODHD",
};
