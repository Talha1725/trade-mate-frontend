import { TradeEditor } from "@/features/admin/trade-editor";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function AdminAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const accountId = (await params).id;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin"
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
              <p className="font-medium text-lg">$10,000.00</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Equity</p>
              <p className="font-medium text-lg text-emerald-600">$10,250.00</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Active
              </div>
            </div>
            <div className="pt-4 border-t flex flex-col gap-2">
              <Button variant="outline" className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700">Suspend Account</Button>
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
