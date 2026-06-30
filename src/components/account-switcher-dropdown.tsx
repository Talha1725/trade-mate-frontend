"use client";

import { useState } from "react";
import { ChevronDown, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DEFAULT_ACCOUNT_SWITCHER_ID,
  mockAccountSwitcherAccounts,
} from "@/lib/mock-data/account-switcher";
import { cn } from "@/lib/utils";
import type { AccountSwitcherDropdownProps } from "@/types/account-switcher";

export function AccountSwitcherDropdown({
  accounts = mockAccountSwitcherAccounts,
  selectedAccountId = DEFAULT_ACCOUNT_SWITCHER_ID,
  onAccountChange,
  className,
}: AccountSwitcherDropdownProps) {
  const [activeAccountId, setActiveAccountId] = useState(selectedAccountId);

  const activeLabel =
    activeAccountId === DEFAULT_ACCOUNT_SWITCHER_ID
      ? DEFAULT_ACCOUNT_SWITCHER_ID
      : (accounts.find((account) => account.id === activeAccountId)?.label ??
        activeAccountId);

  const handleSelect = (accountId: string) => {
    setActiveAccountId(accountId);
    onAccountChange?.(accountId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex min-w-[150px] cursor-pointer items-center gap-2 border border-white/20 rounded-[10px] btn-new-trade px-3 py-2 text-sm text-white outline-none ",
          className,
        )}
      >
        <User className="size-4 shrink-0 text-white" />
        <span className="font-medium!">{activeLabel}</span>
        <ChevronDown className="ml-auto size-4 shrink-0 text-white/80" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[150px]">
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            className="cursor-pointer"
            onClick={() => handleSelect(account.id)}
          >
            {account.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
