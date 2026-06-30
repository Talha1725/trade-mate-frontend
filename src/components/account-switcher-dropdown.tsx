"use client";

import * as React from "react";
import { ChevronDown, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserAccounts } from "@/hooks/use-user-accounts";
import { useSelectedAccountStore } from "@/lib/stores/account-store";
import { cn } from "@/lib/utils";
import type { UserAccountSummary } from "@/types/account";
import type { AccountSwitcherDropdownProps } from "@/types/account-switcher";

function getAccountLabel(
  account: { id: string; accountNumber?: string | null; name?: string | null },
) {
  return account.accountNumber || account.name || account.id;
}

export function AccountSwitcherDropdown({
  accounts,
  selectedAccountId,
  onAccountChange,
  className,
}: AccountSwitcherDropdownProps) {
  const { data } = useUserAccounts();
  const selectedAccountFromStore = useSelectedAccountStore((state) => state.selectedAccountId);
  const setSelectedAccountId = useSelectedAccountStore((state) => state.setSelectedAccountId);

  const resolvedAccounts = React.useMemo(
    () => accounts ?? data?.accounts ?? [],
    [accounts, data?.accounts],
  );
  const activeAccountId = selectedAccountId ?? selectedAccountFromStore ?? resolvedAccounts[0]?.id ?? "";

  React.useEffect(() => {
    if (!selectedAccountFromStore && resolvedAccounts.length > 0) {
      setSelectedAccountId(resolvedAccounts[0].id);
    }
  }, [resolvedAccounts, selectedAccountFromStore, setSelectedAccountId]);

  const activeAccountNumber =
      getAccountLabel(
        resolvedAccounts.find((account) => account.id === activeAccountId) ?? {
          id: activeAccountId,
          accountNumber: null,
          name: "",
        },
    );

  const handleSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
    onAccountChange?.(accountId);
  };

  if (resolvedAccounts.length === 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex min-w-[150px] cursor-pointer items-center gap-2 border border-white/20 rounded-[10px] btn-new-trade px-3 py-2 text-sm text-white outline-none ",
            className,
          )}
        >
          <User className="size-4 shrink-0 text-white" />
          <span className="font-medium!">Select account</span>
          <ChevronDown className="ml-auto size-4 shrink-0 text-white/80" />
        </DropdownMenuTrigger>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex min-w-[150px] cursor-pointer items-center gap-2 border border-white/20 rounded-[10px] btn-new-trade px-3 py-2 text-sm text-white outline-none ",
          className,
        )}
      >
        <User className="size-4 shrink-0 text-white" />
        <span className="font-medium!">{activeAccountNumber}</span>
        <ChevronDown className="ml-auto size-4 shrink-0 text-white/80" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[150px]">
        {resolvedAccounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            className="cursor-pointer"
            onClick={() => handleSelect(account.id)}
          >
            {getAccountLabel(account)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
