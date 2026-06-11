import { DownloadIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PRIMARY_NAV_ITEMS } from "../../constant/nav-config";
import { Button } from "@/components/ui/button";
import { TradeHistoryTable } from "@/components/history/trade-history-table";

export default function HistoryPage() {
  return (
    <AppShell navItems={PRIMARY_NAV_ITEMS} userLabel="trader@trademate.app">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <PageHeader
            title="Trade History"
            description="Review past trades and account performance."
          />
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <TradeHistoryTable />
      </div>
    </AppShell>
  );
}
