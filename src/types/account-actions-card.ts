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
