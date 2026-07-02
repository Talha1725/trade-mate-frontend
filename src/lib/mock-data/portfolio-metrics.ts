import type { PortfolioMetricCard } from "@/types/portfolio-metric-card";

export const mockTotalPortfolioChartValues = [
  46, 50, 58, 54, 48, 52, 60, 56, 50, 55, 63, 68, 62, 70, 74,
];

export const mockPortfolioMetricCards: PortfolioMetricCard[] = [
  {
    id: "balance",
    variant: "icon-stats",
    title: "Balance",
    value: "$50,842.12",
    subtitle: "+$2,315.76 +4.83%",
    valueTone: "default",
    iconSrc: "/images/portfolio/wallet.svg",
    iconTone: "green",
    chartValues: mockTotalPortfolioChartValues,
    subStats: [
      { label: "30 Days High", value: "$52.4K" },
      { label: "Assets", value: "24 Held" },
    ],
  },
  {
    id: "pnl",
    variant: "icon-stats",
    title: "P&L",
    value: "$1,695.49",
    valueTone: "positive",
    subtitle: "Across open positions",
    iconSrc: "/images/portfolio/graph.svg",
    iconTone: "green",
    subStats: [
      { label: "Winning", value: "4 positions", tone: "positive" },
      { label: "Losing", value: "2 positions", tone: "negative" },
    ],
  },
  {
    id: "available-margin",
    variant: "gauge-progress",
    title: "Available Margin",
    value: "$18,234.67",
    subtitle: "Margin usage 63.4%",
    gaugeValue: 63,
    progressValue: 63,
    progressLeftLabel: "Free Margin",
    progressRightLabel: "$18.2K",
  },
  {
    id: "risk-score",
    variant: "icon-stats",
    title: "Risk Score",
    value: "Low",
    valueTone: "positive",
    subtitle: "Healthy portfolio exposure",
    iconSrc: "/images/portfolio/risk.svg",
    iconTone: "orange",
    subStats: [
      { label: "VAR", value: "$1,245" },
      { label: "Compliance", value: "Good", tone: "positive" },
    ],
  },
  {
    id: "profit-target",
    variant: "gauge-progress",
    title: "Profit Target",
    value: "72%",
    subtitle: "$3,612 / $5,000",
    gaugeValue: 72,
    progressValue: 72,
    progressLeftLabel: "Remaining",
    progressRightLabel: "$1,388",
  },
];
