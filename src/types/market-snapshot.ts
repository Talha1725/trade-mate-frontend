import type { SparklineDatum } from "@/types/sparkline-chart";

export type MarketSnapshotBadgeIcon = "momentum" | "risk";

export type MarketSnapshotBadge = {
  id: string;
  label: string;
  icon: MarketSnapshotBadgeIcon;
};

export type MarketSnapshotStatTone = "neutral" | "primary";

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

export type MarketSnapshotCardProps = {
  data?: MarketSnapshotData;
  className?: string;
};
