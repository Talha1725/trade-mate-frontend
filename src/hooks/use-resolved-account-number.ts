import * as React from "react";

import { useUserAccounts } from "@/hooks/use-user-accounts";
import { useSelectedAccountStore } from "@/lib/stores/account-store";

export function useResolvedAccountNumber(snapshotAccountNumber?: string | null) {
  const selectedAccountId = useSelectedAccountStore((state) => state.selectedAccountId);
  const hasHydrated = useSelectedAccountStore((state) => state.hasHydrated);
  const { data: userAccounts } = useUserAccounts();

  return React.useMemo(() => {
    if (snapshotAccountNumber) {
      return snapshotAccountNumber;
    }

    if (!hasHydrated) {
      return null;
    }

    const selectedAccount = userAccounts?.accounts.find(
      (account) => account.id === selectedAccountId,
    );
    const fallbackAccount = selectedAccount ?? userAccounts?.accounts[0];

    return fallbackAccount?.accountNumber ?? null;
  }, [hasHydrated, selectedAccountId, snapshotAccountNumber, userAccounts?.accounts]);
}
