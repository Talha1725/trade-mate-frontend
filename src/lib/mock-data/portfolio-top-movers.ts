import type { PortfolioTopMoverItem } from "@/types/portfolio-top-movers";

export const PORTFOLIO_TOP_MOVERS_BACKGROUND_IMAGE = "/images/portfolio/trending.png";

export const mockPortfolioTopMovers: PortfolioTopMoverItem[] = [
  {
    id: "ethusd",
    symbol: "ETHUSD",
    icon: "ethereum",
    changeAmount: 1147.62,
    changePercent: 7.86,
  },
  {
    id: "btcusd",
    symbol: "BTCUSD",
    icon: "bitcoin",
    changeAmount: 1095.49,
    changePercent: 3.38,
  },
  {
    id: "solusd",
    symbol: "SOLUSD",
    icon: "solana",
    changeAmount: 152.75,
    changePercent: 3.42,
  },
  {
    id: "xrpusd",
    symbol: "XRPUSD",
    icon: "ripple",
    changeAmount: -21.24,
    changePercent: -1.91,
  },
];
