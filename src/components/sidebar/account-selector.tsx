"use client";

import * as React from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserAccounts } from "@/hooks/use-user-accounts";
import { useSelectedAccountStore } from "@/lib/stores/account-store";
import { cn } from "@/lib/utils";

export function AccountSelector() {
  const { data, isLoading } = useUserAccounts();
  const selectedAccountId = useSelectedAccountStore((state) => state.selectedAccountId);
  const hasHydrated = useSelectedAccountStore((state) => state.hasHydrated);
  const setSelectedAccountId = useSelectedAccountStore((state) => state.setSelectedAccountId);

  const accounts = React.useMemo(() => data?.accounts ?? [], [data?.accounts]);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0] ?? null;

  React.useEffect(() => {
    if (!hasHydrated || accounts.length === 0) {
      return;
    }

    if (!selectedAccountId || !accounts.some((account) => account.id === selectedAccountId)) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, hasHydrated, selectedAccountId, setSelectedAccountId]);

  if (!hasHydrated || (isLoading && !selectedAccount)) {
    return (
      <div className="rounded-[16px] border border-white/10 bg-white/5 px-4 py-3">
        <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
        <div className="mt-2 h-9 w-full animate-pulse rounded-lg bg-white/10" />
      </div>
    );
  }

  if (!selectedAccount) {
    return null;
  }

  return (
    <div className="rounded-[16px] border border-white/10 bg-white/5 px-3 py-3">
      <Select
        value={selectedAccount.id}
        onValueChange={(value) => setSelectedAccountId(value)}
      >
          <SelectTrigger className={cn("h-auto w-full justify-between rounded-xl border-white/12 bg-[#111114] px-3 py-2.5 text-left text-white shadow-none hover:bg-white/8")}>
          <SelectValue placeholder="Select account">
            <span className="truncate text-sm font-medium text-white">
              {selectedAccount.accountNumber || selectedAccount.name || selectedAccount.id}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-[#111114] text-white">
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id} className="py-2">
              <span className="truncate text-sm font-medium text-white">
                {account.accountNumber || account.name || account.id}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
