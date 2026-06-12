"use client";

import { use, useEffect, useState } from "react";
import { TradeEditor } from "@/components/admin/trade-editor";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { accountsApi } from "@/lib/services/accounts.api";
import type { AccountSummary, AdminAccountPageProps } from "@/types/admin";
import { toast } from "sonner";

export default function AdminAccountPage({ params }: AdminAccountPageProps) {
  const { id: accountId } = use(params);
  const [account, setAccount] = useState<AccountSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccountDetails = async () => {
    setLoading(true);
    try {
      const data = await accountsApi.getAccountById(accountId);
      setAccount(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load account details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [accountId]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading account parameters...</div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <p className="text-muted-foreground">Account not found.</p>
        <Link href="/admin/accounts" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to Accounts
        </Link>
      </div>
    );
  }

  const isSuspended = account.status === "Suspended";
  const statusClassName = isSuspended
    ? "bg-rose-100 text-rose-800"
    : "bg-emerald-100 text-emerald-800";
  const statusActionLabel = isSuspended ? "Activate Account" : "Suspend Account";
  const formattedBalance = account.balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedEquity = account.equity.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const toggleStatus = async () => {
    const nextStatus: AccountSummary["status"] = isSuspended ? "Active" : "Suspended";
    try {
      const updated = await accountsApi.updateAccount(accountId, { status: nextStatus });
      setAccount(updated);
      toast.success(`Account status updated to ${nextStatus}.`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const resetBalance = async () => {
    try {
      const updated = await accountsApi.updateAccount(accountId, { balance: 10000, equity: 10000 });
      setAccount(updated);
      toast.success("Account balance reset to $10,000.00.");
    } catch {
      toast.error("Failed to reset balance.");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/accounts"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2 -ml-2 text-muted-foreground hover:text-foreground")}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Accounts
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Account Overview" className="lg:col-span-1">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Account ID</p>
              <p className="font-medium text-lg font-mono">{accountId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="font-medium text-lg">${formattedBalance}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Equity</p>
              <p className="font-medium text-lg text-emerald-600">${formattedEquity}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className={cn("inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold", statusClassName)}>
                {account.status}
              </div>
            </div>
            <div className="pt-4 border-t flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={toggleStatus}
                className={cn(
                  "w-full",
                  isSuspended
                    ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                    : "text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                )}
              >
                {statusActionLabel}
              </Button>
              <Button onClick={resetBalance} variant="outline" className="w-full">Reset Balance</Button>
            </div>
          </div>
        </SectionCard>

        <div className="lg:col-span-2">
          <TradeEditor accountId={accountId} />
        </div>
      </div>
    </div>
  );
}
