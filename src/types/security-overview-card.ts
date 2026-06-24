export type SecurityOverviewValueTone = "default" | "positive" | "masked";

export type SecurityOverviewRow = {
  id: string;
  label: string;
  value: string;
  valueTone?: SecurityOverviewValueTone;
  showVerifiedIcon?: boolean;
  actionLabel?: string;
};

export type SecurityOverviewCardProps = {
  title?: string;
  rows?: SecurityOverviewRow[];
  onChangePassword?: () => void;
  onManageEmailVerification?: () => void;
  onManageLoginAlerts?: () => void;
  className?: string;
};
