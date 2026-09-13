export type AccountActionIconTone = "green" | "red" | "purple";

export type AccountActionItem = {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
  iconTone: AccountActionIconTone;
};

export type AccountActionsCardProps = {
  title?: string;
  actions?: AccountActionItem[];
  onActionClick?: (actionId: string) => void;
  className?: string;
};

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

export type AccountInformationStatTone = "default" | "positive" | "negative";

export type AccountInformationStat = {
  id: string;
  label: string;
  value: string;
  valueTone?: AccountInformationStatTone;
  showVerifiedIcon?: boolean;
};

export type AccountInformationCardProps = {
  title?: string;
  initials?: string;
  fullName?: string;
  email?: string;
  memberSince?: string;
  avatarUrl?: string | null;
  stats?: AccountInformationStat[];
  editProfileLabel?: string;
  onEditProfile?: () => void;
  className?: string;
};

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

export type SubscriptionPlanCardProps = {
  title?: string;
  planName?: string;
  planStatusLabel?: string;
  renewsOn?: string;
  monthlyFee?: string;
  managePlanLabel?: string;
  billingHistoryLabel?: string;
  viewHistoryLabel?: string;
  onManagePlan?: () => void;
  onViewHistory?: () => void;
  className?: string;
};
