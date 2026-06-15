import { TradeEditor } from "@/components/admin/trade-editor";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockAccounts } from "@/lib/mock-data/accounts";
import type { AdminAccountPageProps } from "@/types/admin";
import { notFound } from "next/navigation";

export default async function AdminAccountPage({ params }: AdminAccountPageProps) {
  const accountId = (await params).id;
  const account = mockAccounts.find((item) => item.id === accountId);

  if (!account) {
    notFound();
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
              <p className="font-medium text-lg">{accountId}</p>
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
                className={cn(
                  "w-full",
                  isSuspended
                    ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                    : "text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                )}
              >
                {statusActionLabel}
              </Button>
              <Button variant="outline" className="w-full">Reset Balance</Button>
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
