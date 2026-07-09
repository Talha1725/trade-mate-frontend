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
import type { AccountSwitcherDropdownProps } from "@/types/account-switcher";

function getAccountLabel(
  account: { id: string; accountNumber?: string | null; name?: string | null },
) {
  return account.accountNumber || account.name || account.id;
}

function getAccountStatusLabel(status?: string | null) {
  if (!status) {
    return "Unknown";
  }

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function getAccountStatusTone(status?: string | null) {
  const normalized = status?.toLowerCase();
  if (normalized === "active") {
    return "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";
  }

  if (normalized === "suspended" || normalized === "inactive") {
    return "bg-rose-500/15 text-rose-300 border-rose-400/30";
  }

  return "bg-white/10 text-white/70 border-white/15";
}

export function AccountSwitcherDropdown({
  accounts,
  selectedAccountId,
  onAccountChange,
  className,
}: AccountSwitcherDropdownProps) {
  const { data } = useUserAccounts();
  const selectedAccountFromStore = useSelectedAccountStore((state) => state.selectedAccountId);
  const hasHydrated = useSelectedAccountStore((state) => state.hasHydrated);
  const setSelectedAccountId = useSelectedAccountStore((state) => state.setSelectedAccountId);

  const resolvedAccounts = React.useMemo(
    () => accounts ?? data?.accounts ?? [],
    [accounts, data?.accounts],
  );
  const activeAccountId =
    selectedAccountId ?? selectedAccountFromStore ?? (hasHydrated ? resolvedAccounts[0]?.id ?? "" : "");

  React.useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!selectedAccountFromStore && resolvedAccounts.length > 0) {
      setSelectedAccountId(resolvedAccounts[0].id);
    }
  }, [hasHydrated, resolvedAccounts, selectedAccountFromStore, setSelectedAccountId]);

  const activeAccountNumber = getAccountLabel(
    resolvedAccounts.find((account) => account.id === activeAccountId) ?? {
      id: activeAccountId,
      accountNumber: null,
      name: "",
    },
  );
  const activeAccountStatus = resolvedAccounts.find((account) => account.id === activeAccountId)?.status ?? null;

  const handleSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
    onAccountChange?.(accountId);
  };

  if (!hasHydrated || resolvedAccounts.length === 0) {
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
        <span
          className={cn(
            "ml-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            getAccountStatusTone(activeAccountStatus),
          )}
        >
          {getAccountStatusLabel(activeAccountStatus)}
        </span>
        <ChevronDown className="ml-auto size-4 shrink-0 text-white/80" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[150px]">
        {resolvedAccounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            className="flex cursor-pointer items-center justify-between gap-3"
            onClick={() => handleSelect(account.id)}
          >
            <span>{getAccountLabel(account)}</span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                getAccountStatusTone(account.status),
              )}
            >
              {getAccountStatusLabel(account.status)}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
