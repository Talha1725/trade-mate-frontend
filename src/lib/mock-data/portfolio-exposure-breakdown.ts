import type { PortfolioExposureItem } from "@/types/portfolio-exposure-breakdown";

export const PORTFOLIO_EXPOSURE_BACKGROUND_IMAGE = "/images/portfolio/cube.png";

export const mockPortfolioExposureItems: PortfolioExposureItem[] = [
  {
    id: "crypto",
    label: "Crypto",
    percent: 78,
    iconSrc: "/images/portfolio/btc.svg",
    iconTone: "green",
    fill: "linear-gradient(180deg, #0CE9A0 0%, #108961 100%)",
  },
  {
    id: "stable",
    label: "Stable",
    percent: 12,
    iconSrc: "/images/portfolio/dollar.svg",
    iconTone: "blue",
    fill: "linear-gradient(180deg, #60A5FA 0%, #3B82F6 100%)",
  },
  {
    id: "cash",
    label: "Cash",
    percent: 6,
    iconSrc: "/images/portfolio/cash.svg",
    iconTone: "orange",
    fill: "linear-gradient(180deg, #FFB265 0%, #FF8000 100%)",
  },
];
