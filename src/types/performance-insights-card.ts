import type { PortfolioMetricIconTone } from "@/types/portfolio-metric-card";

export type PerformanceInsightTitleTone = PortfolioMetricIconTone;

export type PerformanceInsightItem = {
  id: string;
  title: string;
  titleTone: PerformanceInsightTitleTone;
  description: string;
  iconSrc: string;
  iconTone: PortfolioMetricIconTone;
};

export type PerformanceInsightsCardProps = {
  title?: string;
  insights?: PerformanceInsightItem[];
  className?: string;
};
