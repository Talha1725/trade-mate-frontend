export type SymbolBreakdownDatum = {
  name: string;
  value: number;
};

export type EquityCurveDatum = {
  name: string;
  equity: number;
};

export type PositionSummary = {
  symbol: string;
  type: "Buy" | "Sell";
  volume: number;
  profit: number;
};

export type RecentActivityItem = {
  symbol: string;
  action: string;
  price: number;
  dateLabel: string;
};

export type StatCardDatum = {
  title: string;
  value: string;
  description: string;
  tone?: "success";
};
