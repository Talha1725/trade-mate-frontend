export type PortfolioAllocationItem = {
  id: string;
  label: string;
  percent: number;
  value: number;
  color: string;
};

export type PortfolioAllocationCardProps = {
  title?: string;
  items?: PortfolioAllocationItem[];
  backgroundImageSrc?: string;
  className?: string;
};
