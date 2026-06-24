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
