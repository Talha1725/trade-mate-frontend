import type { MarketSnapshotData } from "@/types/market-snapshot";

export const mockMarketSnapshot: MarketSnapshotData = {
  price: 69102.75,
  changePercent: 0.86,
  isLive: true,
  badges: [
    { id: "momentum", label: "Momentum Strong", icon: "momentum" },
    { id: "risk", label: "Risk Healthy", icon: "risk" },
  ],
  stats: [
    { id: "day-range", label: "Day Range", value: "68,210 — 69,243" },
    { id: "volume", label: "Volume 24h", value: "18.42K BTC" },
    { id: "market-cap", label: "Market Cap", value: "$1.36T" },
    { id: "dominance", label: "Dominance", value: "49.2%" },
    { id: "fear-greed", label: "Fear & Greed", value: "72 (Greed)", tone: "primary" },
  ],
  sparkline: [
    { value: 68210 },
    { value: 68450 },
    { value: 68320 },
    { value: 68680 },
    { value: 68540 },
    { value: 68890 },
    { value: 68720 },
    { value: 69010 },
    { value: 68940 },
    { value: 69102 },
  ],
};
