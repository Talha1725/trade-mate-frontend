export type PortfolioExposureIconTone = "green" | "blue" | "orange";

export type PortfolioExposureItem = {
  id: string;
  label: string;
  percent: number;
  iconSrc: string;
  iconTone: PortfolioExposureIconTone;
  fill: string;
};

export type PortfolioExposureBreakdownCardProps = {
  title?: string;
  badgeLabel?: string;
  items?: PortfolioExposureItem[];
  backgroundImageSrc?: string;
  className?: string;
};
