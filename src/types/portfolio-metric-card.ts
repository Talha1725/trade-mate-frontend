export type PortfolioMetricIconTone = "green" | "orange" | "red" | "blue";

export type PortfolioMetricIconKind =
  | "image"
  | "chart-spline"
  | "trend-down"
  | "target"
  | "trophy";

export type PortfolioMetricValueTone = "default" | "positive" | "negative";

export type PortfolioMetricSubtitleTone = "default" | "positive" | "negative";

export type PortfolioMetricSubStatTone = "default" | "positive" | "negative";

export type PortfolioMetricSubStat = {
  label: string;
  value: string;
  tone?: PortfolioMetricSubStatTone;
};

export type PortfolioMetricCardBase = {
  id: string;
  title: string;
  value: string;
  valueTone?: PortfolioMetricValueTone;
  subtitle?: string;
  subtitleTone?: PortfolioMetricSubtitleTone;
};

export type PortfolioMetricIconCard = PortfolioMetricCardBase & {
  variant: "icon-stats";
  iconSrc?: string;
  iconKind?: PortfolioMetricIconKind;
  iconTone: PortfolioMetricIconTone;
  subStats: [PortfolioMetricSubStat, PortfolioMetricSubStat];
  chartValues?: number[];
};

export type PortfolioMetricGaugeCard = PortfolioMetricCardBase & {
  variant: "gauge-progress";
  gaugeValue: number;
  progressValue: number;
  progressLeftLabel: string;
  progressRightLabel: string;
};

export type PortfolioMetricCard = PortfolioMetricIconCard | PortfolioMetricGaugeCard;

export type PortfolioMetricCardsProps = {
  cards?: PortfolioMetricCard[];
  className?: string;
};
