export type MiniAreaLineChartPalette = "profit" | "loss";

export type MiniAreaLineChartProps = {
  values: number[];
  className?: string;
  strokeId?: string;
  fromZero?: boolean;
  palette?: MiniAreaLineChartPalette;
  showEndDot?: boolean;
};
