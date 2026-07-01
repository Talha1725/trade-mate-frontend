import * as React from "react";

import { useUserAccounts } from "@/hooks/use-user-accounts";
import { useSelectedAccountStore } from "@/lib/stores/account-store";

export function useResolvedAccountNumber(snapshotAccountNumber?: string | null) {
  const selectedAccountId = useSelectedAccountStore((state) => state.selectedAccountId);
  const { data: userAccounts } = useUserAccounts();

  return React.useMemo(() => {
    if (snapshotAccountNumber) {
      return snapshotAccountNumber;
    }

    const selectedAccount = userAccounts?.accounts.find(
      (account) => account.id === selectedAccountId,
    );
    const fallbackAccount = selectedAccount ?? userAccounts?.accounts[0];

    return fallbackAccount?.accountNumber ?? null;
  }, [selectedAccountId, snapshotAccountNumber, userAccounts?.accounts]);
}
