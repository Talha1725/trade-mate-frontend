import type { SparklineDatum } from "@/types/sparkline-chart";

export type MarketSnapshotBadgeIcon = "momentum" | "risk";

export type MarketSnapshotBadge = {
  id: string;
  label: string;
  icon: MarketSnapshotBadgeIcon;
};

export type MarketSnapshotStatTone = "neutral" | "primary" | "success" | "warning" | "destructive";

export type MarketSnapshotStat = {
  id: string;
  label: string;
  value: string;
  tone?: MarketSnapshotStatTone;
};

export type MarketSnapshotData = {
  price: number;
  changePercent: number;
  isLive: boolean;
  badges: MarketSnapshotBadge[];
  stats: MarketSnapshotStat[];
  sparkline: SparklineDatum[];
};

export type MarketSnapshotChartSummary = {
  interval: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  changePercent: number;
  time: string;
  source: string;
};

export type MarketSnapshotResponse = {
  symbol: string;
  interval: string;
  chart: MarketSnapshotChartSummary;
  snapshot: MarketSnapshotData;
};

export type MarketSnapshotCardProps = {
  data?: MarketSnapshotData;
  symbol?: string | null;
  assetClass?: string | null;
  className?: string;
};
