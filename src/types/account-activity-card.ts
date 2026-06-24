export type AccountActivityRowVariant = "text" | "sessions" | "region";

export type AccountActivityRow = {
  id: string;
  label: string;
  value: string;
  variant?: AccountActivityRowVariant;
  regionLabel?: string;
  flagEmoji?: string;
};

export type AccountActivityCardProps = {
  title?: string;
  rows?: AccountActivityRow[];
  onActiveSessionsClick?: () => void;
  className?: string;
};
