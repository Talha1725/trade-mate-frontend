import type { PortfolioAllocationItem } from "@/types/portfolio-allocation";

export const PORTFOLIO_ALLOCATION_BACKGROUND_IMAGE = "/images/portfolio/mask.png";

export const mockPortfolioAllocationItems: PortfolioAllocationItem[] = [
  {
    id: "crypto",
    label: "Crypto",
    percent: 78,
    value: 39095.75,
    color: "#22E0A2",
  },
  {
    id: "stable",
    label: "Stable",
    percent: 12,
    value: 6011.08,
    color: "#3B82F6",
  },
  {
    id: "cash",
    label: "Cash",
    percent: 6,
    value: 3017.28,
    color: "#FF8000",
  },
  {
    id: "other",
    label: "Other",
    percent: 4,
    value: 2000,
    color: "#03D5D5",
  },
];
