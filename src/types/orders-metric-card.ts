export type OrdersMetricSubtitleTone = "default" | "positive";

export type OrdersMetricValueTone = "default" | "positive";

export type OrdersMetricIconCard = {
  id: string;
  variant: "icon";
  title: string;
  value: string;
  subtitle: string;
  subtitleTone?: OrdersMetricSubtitleTone;
  valueTone?: OrdersMetricValueTone;
  iconSrc: string;
};

export type OrdersMetricChartCard = {
  id: string;
  variant: "chart";
  title: string;
  value: string;
  subtitle: string;
  chartValues: number[];
};

export type OrdersMetricCard = OrdersMetricIconCard | OrdersMetricChartCard;

export type OrdersMetricCardsProps = {
  cards?: OrdersMetricCard[];
  className?: string;
};
