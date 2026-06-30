export type AccountSwitcherItem = {
  id: string;
  label: string;
};

export type AccountSwitcherDropdownProps = {
  accounts?: AccountSwitcherItem[];
  selectedAccountId?: string;
  onAccountChange?: (accountId: string) => void;
  className?: string;
};
