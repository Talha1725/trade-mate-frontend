export type ChallengeProgressStatTone = "completed" | "remaining";

export type ChallengeProgressStatRow = {
  id: string;
  label: string;
  valuePrimary: string;
  valueSecondary: string;
  tone: ChallengeProgressStatTone;
};

export type ChallengeProgressCardProps = {
  title?: string;
  statusLabel?: string;
  progress?: number;
  progressLabel?: string;
  stats: ChallengeProgressStatRow[];
  message?: string;
  backgroundImageSrc?: string;
  shieldIconSrc?: string;
  className?: string;
};

export type ChallengeProgressDonutProps = {
  value: number;
  label?: string;
  className?: string;
  size?: number;
};
