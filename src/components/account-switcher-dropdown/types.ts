import type { UserAccountSummary } from "@/types/account";

export type AccountSwitcherItem = Pick<UserAccountSummary, "id" | "accountNumber" | "status"> & {
  name?: string | null;
};

export type AccountSwitcherDropdownProps = {
  accounts?: AccountSwitcherItem[];
  selectedAccountId?: string;
  onAccountChange?: (accountId: string) => void;
  className?: string;
};
