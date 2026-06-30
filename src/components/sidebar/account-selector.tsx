"use client";

import * as React from "react";

import { ChevronDown } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserAccounts } from "@/hooks/use-user-accounts";
import { useSelectedAccountStore } from "@/lib/stores/account-store";
import { cn } from "@/lib/utils";

function formatAccountLabel(accountNumber: string | null, fallbackName: string) {
  return accountNumber || fallbackName || "Trading Account";
}

export function AccountSelector() {
  const { data, isLoading } = useUserAccounts();
  const selectedAccountId = useSelectedAccountStore((state) => state.selectedAccountId);
  const setSelectedAccountId = useSelectedAccountStore((state) => state.setSelectedAccountId);

  const accounts = data?.accounts ?? [];
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0] ?? null;

  React.useEffect(() => {
    if (accounts.length === 0) {
      return;
    }

    if (!selectedAccountId || !accounts.some((account) => account.id === selectedAccountId)) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId, setSelectedAccountId]);

  if (isLoading && !selectedAccount) {
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
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Active account</p>
          <p className="mt-1 text-xs text-white/65">
            {selectedAccount.fundingType || "Stored funding profile"}
          </p>
        </div>
        <ChevronDown className="size-4 text-white/35" />
      </div>

      <Select
        value={selectedAccount.id}
        onValueChange={(value) => setSelectedAccountId(value)}
      >
        <SelectTrigger className={cn("h-auto w-full justify-between rounded-xl border-white/12 bg-[#111114] px-3 py-2.5 text-left text-white shadow-none hover:bg-white/8")}>
          <SelectValue placeholder="Select account">
            <div className="flex min-w-0 flex-col items-start">
              <span className="truncate text-sm font-medium text-white">
                {formatAccountLabel(selectedAccount.accountNumber, selectedAccount.name)}
              </span>
              <span className="truncate text-[11px] text-white/45">
                {selectedAccount.accountNumber || selectedAccount.id}
                {selectedAccount.fundingType ? ` · ${selectedAccount.fundingType}` : ""}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-[#111114] text-white">
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id} className="py-2">
              <div className="flex min-w-0 flex-col items-start">
                <span className="truncate text-sm font-medium text-white">
                  {formatAccountLabel(account.accountNumber, account.name)}
                </span>
                <span className="truncate text-[11px] text-white/45">
                  {account.accountNumber || account.id}
                  {account.fundingType ? ` · ${account.fundingType}` : ""}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

